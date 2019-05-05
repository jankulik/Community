var names = [];
var table_content;
var width = 1;

function getAccounts(start)
{
	var accounts = document.getElementById("account_names").value;
	var follow = [];

	var bar = document.getElementById("bar"); 
	var id = setInterval(frame, 10);
	function frame()
	{
		if(width >= 99 || width >= ((start + 100) / accounts.split('\n').length) * 100)
			clearInterval(id);
		else
		{
			width++; 
			bar.style.width = width + '%'; 
			bar.innerHTML = width * 1 + '%';
		}
	}

	if(start == 0)
	{
		names = [];
		for(var i = 0; i < accounts.split('\n').length; i++)
			names.push(accounts.split('\n')[i]);

		width = 1;
		bar.style.width = width + '%'; 
		bar.innerHTML = width * 1 + '%';
		bar.style.display = 'block';

		document.getElementById("table").innerHTML = '';
		table_content = `
			<table id="table">
			<tr>
				<th> Name </th>
				<th> Total SP </th>
				<th> Delegated SP </th>
				<th> Reputation </th>
				<th> Days Since Post </th>
				<th> Days Since Comment </th>
				<th> Days Since Vote </th>
				<th> Number of Posts </th>
				<th> Followers </th>
				<th> Followings </th>
			</tr>`;
	}

	var subNames = [];
	for(var i = start; (i < (start + 99)) && (i < names.length); i++)
	{
		subNames.push(names[i]);

		steem.api.getFollowCount(names[i], function(err, followCount)
		{
			follow.push(followCount);
		});
	}

	steem.api.getDynamicGlobalProperties(function(err2, globalProperties)
	{
		steem.api.getAccounts(subNames, function(err3, accountDetails)
		{
			var total_vesting_shares = globalProperties.total_vesting_shares.split(' ')[0];
			var total_vesting_fund_steem = globalProperties.total_vesting_fund_steem.split(' ')[0];

			var one_day = 24 * 60 * 60 * 1000;

			for(var i = 0; i < subNames.length; i++)
			{
				if(accountDetails[i] !== undefined)
				{
					var account_vesting_shares = parseInt(accountDetails[i].vesting_shares.split(' ')[0]);
					var delegated_vesting_shares = parseInt(accountDetails[i].delegated_vesting_shares.split(' ')[0]);
					var total_delegated_vesting_shares = parseInt(accountDetails[i].received_vesting_shares.split(' ')[0] - accountDetails[i].delegated_vesting_shares.split(' ')[0]);
					var total_account_vesting_shares = account_vesting_shares + total_delegated_vesting_shares;

					var today = Date.now();
					var last_post = new Date(accountDetails[i].last_post);
					var last_root = new Date(accountDetails[i].last_root_post);
					var last_vote = new Date(accountDetails[i].last_vote_time);

					var followersCount = 0;
					var followingsCount = 0;

					for(var j = 0; j < follow.length; j++)
					{
						if(subNames[i] === follow[j].account)
						{
							followersCount = follow[j].follower_count;
							followingsCount = follow[j].following_count;
						}
					}

					table_content += `
						<tr>
							<td> ${accountDetails[i].name} </td>
							<td> ${Math.round(steem.formatter.vestToSteem(total_account_vesting_shares, total_vesting_shares, total_vesting_fund_steem))} </td>
							<td> ${Math.round(steem.formatter.vestToSteem(delegated_vesting_shares, total_vesting_shares, total_vesting_fund_steem))} </td>
							<td> ${steem.formatter.reputation(accountDetails[i].reputation)} </td>
							<td> ${Math.round((today - last_root.getTime()) / one_day)} </td>
							<td> ${Math.round((today - last_post.getTime()) / one_day)} </td>
							<td> ${Math.round((today - last_vote.getTime()) / one_day)} </td>
							<td> ${accountDetails[i].post_count} </td>
							<td> ${followersCount} </td>
							<td> ${followingsCount} </td>
						</tr>`;
				}
			}

			if((start + 100) > names.length)
			{	
				table_content += `</table>`;
				bar.style.width = 100 + '%'; 
				bar.innerHTML = 100 * 1 + '%';
				bar.style.display = 'none';

				document.getElementById("table").innerHTML = table_content;

				$("table").tableExport({
					headings: true,                    // (Boolean), display table headings (th/td elements) in the <thead>
				    footers: true,                     // (Boolean), display table footers (th/td elements) in the <tfoot>
				    formats: ["xlsx", "xls", "csv", "txt"],    // (String[]), filetypes for the export
				    fileName: "id",                    // (id, String), filename for the downloaded file
				    bootstrap: true,                   // (Boolean), style buttons using bootstrap
				    position: "top",                // (top, bottom), position of the caption element relative to table
				    ignoreRows: null,                  // (Number, Number[]), row indices to exclude from the exported file(s)
				    ignoreCols: null,                  // (Number, Number[]), column indices to exclude from the exported file(s)
				    ignoreCSS: ".tableexport-ignore",  // (selector, selector[]), selector(s) to exclude from the exported file(s)
				    emptyCSS: ".tableexport-empty",    // (selector, selector[]), selector(s) to replace cells with an empty string in the exported file(s)
				    trimWhitespace: true              // (Boolean), remove all leading/trailing newlines, spaces, and tabs from cell text in the exported file(s)
				});
			}
			else
				setTimeout(function(){getAccounts(start + 100);}, 35000);
		});
	});
}