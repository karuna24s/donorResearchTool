function toSingleCell(contributions) {
  return contributions.map(function(contribution){
    if (contribution[0] != ""){
      return "$" + contribution[0] + " - " + contribution[1] + " - " + contribution[2]
    } else {
      return ""
    }
  }).join("</br>")
}

function joinYears(year1, year2, year3, year4 ,year5){
  var resultYears = [year1, year2, year3, year4, year5].filter(function(year){
    return year[0] != "#" ? true : false
  })
  var uniqueGives = fromMultiple(resultYears)
  return toOneCell(uniqueGives)
  //return combined.join("</br>")
}

function joinDonors(don1, don2){
  var uniqueGives = fromMultiple([don1, don2])
  return toOneCell(uniqueGives)
}

function fromMultiple(resultYears){
  var uniqueGives = []
  var combined = resultYears.map(function(year){
    if (year.length > 1){
      var sortedYear = year.sort(function(a,b){
        var x = new Date(a[2]);
        var y = new Date(b[2]);
        if (x < y) {return 1;}
        if (x > y) {return -1;}
        return 0;
      })
    } else {
      var sortedYear = year
    }
    for(var i = 0; i < sortedYear.length; i++){
      if(sortedYear[i][0] != ""){
        var currentGive = uniqueGives.filter(function(e) { return e.committee === sortedYear[i][1]; })
        if (currentGive.length == 1) {
          currentGive[0].contributions.push("$" + sortedYear[i][0] + " - " + sortedYear[i][2])
        } else {
          var contribution = "$" + sortedYear[i][0] + " - " + sortedYear[i][2]
          uniqueGives.push({
            committee: sortedYear[i][1],
            contributions: [contribution]
          })
        }
      }
    }
    return toSingleCell(sortedYear)
  })
  uniqueGives.forEach(function(ug){
      ug.contributions.sort(function(a,b){
        var x = new Date(a.split(" - ")[1]);
        var y = new Date(b.split(" - ")[1]);
        if (x < y) {return 1;}
        if (x > y) {return -1;}
        return 0;
      })
    })
  return uniqueGives.sort(function(a,b){
    var x = new Date(a.contributions[0].split(" - ")[1])
    var y = new Date(b.contributions[0].split(" - ")[1])
    if (x < y) {return 1;}
    if (x > y) {return -1;}
    return 0;
  })
}

function toOneList(year1, year2, year3, year4, year5){
  var resultYears = [year1, year2, year3, year4, year5].filter(function(year){
    return year[0] != "#" ? true : false
  })
  var together = []
  resultYears.forEach(function(year){
    year.forEach(function(row){
      var testString = row[0]
      if (row[0] != "" && testString.slice(0,6) != "No res"){
        together.push(row)
      }
    })
  })
  return together
}

function toOneCell(results){
  return results.map(function(ug){
    if(ug.contributions.length > 1){
      var totalRows = []
      var currentRow = []
      for(var i = ug.contributions.length-1; i >= 0; i--){
        totalRows.push(ug.contributions.shift())
       }
      return ug.committee + "--(" + totalRows.join(") - (")+ ")"

    } else {
      var splitUp = ug.contributions[0].split(" - ");
      return [ug.committee,splitUp[0],splitUp[1]].join(" - ")
    }
  }).join("</br></br>")
}

function joinTwo(res1, res2){
  var one = breakDown(res1)
  var two = breakDown(res2)
  return joinDonors(one,two)
}

function updateFormat(column){
  return column.map(function(cell){
    if (cell == ""){
      return cell
    }
    var rawRow = oldBreakDown(String([cell]).split("</br></br>"))
    var uniqueG = fromMultiple([rawRow])
    return toOneCell(uniqueG)
  })
}

function oldBreakDown(broken){
  var cObjects = []
  broken.forEach(function(don){
    var pieces = don.split("</br>")
    if (pieces.length > 1){
      var committee = pieces.shift()
      var contributions = []
      pieces.forEach(function(piece){
        piece.split("/---/ <---> ").join("").split(" <---> ").forEach(function(x){
          contributions.push(x)
        })
      })
      var newCon = []
      contributions.forEach(function(cn){
        var splitUp = cn.split(" - ")
        newCon.push([splitUp[0].split("$")[1],committee,splitUp[1]])
      })
      newCon.forEach(function(nc){
        cObjects.push(nc)
      })
    } else {
      var splitUp = don.split(" - ")
      cObjects.push([splitUp[1].split("$")[1],splitUp[0],splitUp[2]])
    }
  })
  return cObjects
}

function breakDown(res){
  var broken = res.split("</br></br>")
  var cObjects = []
  broken.forEach(function(don){
    var pieces = don.split("--(")
    if (pieces.length > 1){
      var committee = pieces.shift()
      var contributions = []
      var realPieces = pieces[0].split(") - (")
      realPieces.forEach(function(piece){
        var realX = piece.split(")").join("")
        contributions.push(realX)
      })
      var newCon = []
      contributions.forEach(function(cn){
        var splitUp = cn.split(" - ")
        newCon.push([splitUp[0].split("$")[1],committee,splitUp[1]])
      })
      newCon.forEach(function(nc){
        cObjects.push(nc)
      })
    } else {
      var splitUp = don.split(" - ")
      cObjects.push([splitUp[1].split("$")[1],splitUp[0],splitUp[2]])
    }
  })
  return cObjects
}


function combineRows(row1, row2){
  var returnRow = []
  for (var i = 0; i < row1[0].length; i++){
    if (i != 6){
      returnRow.push(row1[0][i])
    } else if (i == 6) {
      returnRow.push(joinTwo(row1[0][6], row2[0][6]))
    }
  }
  return [returnRow]
}

function cm(severalRows){
  var currentRow = [severalRows.shift()]
  for(var i = 0; i < severalRows.length; i++){
    currentRow = combineRows(currentRow, [severalRows[i]])
  }
  return currentRow
}
