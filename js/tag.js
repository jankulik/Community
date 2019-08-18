var tag;
var width = 1;
var input = document.getElementById("tag_name");
input.addEventListener("keyup", function(event)
{
  if(event.keyCode === 13)
  {
    event.preventDefault();
    document.getElementById("button").click();
  }
});

function getAccountsByTag(start)
{
  var query = {
    tag: tag,
    limit: 10,
    start: start
  };

  steem.api.getDiscussionsByCreated(query, function(err, result)
  {
    console.log(result);

    var table = document.getElementById("table");
    var one_day = 24 * 60 * 60 * 1000;
    //Math.round((today - last_root.getTime()) / one_day);

    for(var i = 0; i < result.length; i++)
    {
      var row = table.insertRow(account_index);
      var cell = row.insertCell(0);
      cell.innerHTML = result[i].name;
    }

    if((start + 100) > names.length)
    {
      bar.style.width = 100 + '%'; 
      bar.innerHTML = 100 * 1 + '%';
      bar.style.display = 'none';

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
      setTimeout(function(){getAccountsByTag(start + 100);}, 100);
  });
}

function submit()
{
  tag = document.getElementById("tag_name").value;

  var bar = document.getElementById("bar"); 
  var id = setInterval(frame, 10);

  width = 1;
  bar.style.width = width + '%'; 
  bar.innerHTML = width * 1 + '%';  
  bar.style.display = 'block';

  function frame()
  {
    if(width >= 99)
      clearInterval(id);
    else
    {
      width++; 
      bar.style.width = width + '%'; 
      bar.innerHTML = width * 1 + '%';
    }
  }

  table_content = `
    <table id="table">
      <tr>
        <th> Name </th>
      </tr>
    </table>`;

  document.getElementById("table_span").innerHTML = table_content;

  getAccountsByTag('');
}
