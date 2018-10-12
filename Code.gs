function testExample(sheetValues){
  return sheetValues.map(function(row){
    return row.join(" ")
  })
}

function prepAPIcall(name_row, year, states){
  var nameQuery = name_row.join(" ");
    var url = 'https://api.open.fec.gov/v1/schedules/schedule_a/?'
      + 'min_amount=200'
      + '&per_page=100'
      +  states
      + '&is_individual=true'
      + '&sort=contribution_receipt_date'
      + '&two_year_transaction_period=' + year
      + '&contributor_name=' + encodeURIComponent(nameQuery)
      + '&api_key=Add your API Key Here';
    return url
}

function getStatesArray(states_input){
  if (!states_input){
    return []
  } else {
    var enteredStates = states_input.filter(function(state){
      return state != "" ? true : false
    })
  }
  return enteredStates.map(function(state){
    return '&contributor_state=' + state[0]
  }).join("")
}

function searchFEC(names_array, year, states_input) {
  var names = []
  var states = getStatesArray(states_input)
  var preppedAPIcalls = names_array.map(function(name_row){
    return prepAPIcall(name_row, year, states)
  })
  var fetchedResponses = UrlFetchApp.fetchAll(preppedAPIcalls)
  var queryResponses = fetchedResponses.map(function(response){
    return JSON.parse(response)
  })
  for(var j = 0; j < queryResponses.length; j++){
    if (queryResponses[j].error){
      names.push([names_array[j][0], names_array[j][1], "Request Error"])
    } else if(queryResponses[j].pagination.count < 1){
      names.push([names_array[j][0], names_array[j][1], "No results found"])
    } else {
      for(var i = 0; i < queryResponses[j].results.length; i++){
        var current = queryResponses[j].results[i];
        names.push([names_array[j][0], names_array[j][1],
                    current.contributor_first_name,
                    current.contributor_last_name,
                    current.contributor_state,
                    current.contributor_city,
                    current.contributor_zip,
                    current.contributor_aggregate_ytd,
                    current.contribution_receipt_amount,
                    current.committee.name,
                    current.committee.state,
                    current.memo_text,
                    current.contribution_receipt_date.split("T")[0],
                    current.contributor_occupation,
                    current.contributor_employer,
                    current.pdf_url
                   ]);

      }
    }
  };
  return names
}

function testAPI(){
  return searchFEC([['Jim', 'Bob'],['Joe', 'Bob']])
}
