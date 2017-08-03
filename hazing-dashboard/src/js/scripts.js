import $ from 'jquery';
import pym from 'pym.js';
/*global d3: true */
import _ from 'lodash';
const pymChild = new pym.Child();

//cool resource to figure out how to stack bar chart: https://stackoverflow.com/questions/29216950/d3js-stacked-horizontal-bar-how-to-split-categories-into-bars


$.getJSON("data/sports.json", function(data) {
  //sets default chart to appear
  drawChart(parseQ1(data));

  $("#questions").on("change",function() {
    const qval = parseInt($("#questions option:selected").val()); //gets index of option value on selection
    const expVal = $("#experience option:selected").text(); //gets index of option value on selection
    let qdata;

    let newData = [
      {answers: []},
      {answers: []},
      {answers: []},
      {answers: []},
      {answers: []},
    ]

    if (expVal === "All") {
      newData = data;
    } else {
      const filteredData = _.filter(data[qval].answers, {'experience': expVal});
      newData[qval].answers = filteredData;
    }

    switch(qval) {
      case 1:
        qdata = parseQ1(newData)
        break;
      case 2:
        qdata = parseQ2(newData)
        break;
      case 3:
        qdata = parseQ3(newData)
        break;
      case 4:
        qdata = parseQ4(newData)
        break;
      default:
        "not a valid case"
    }
    drawChart(qdata);
  })

  $("#experience").on("change", function() {
    const expVal = $("#experience option:selected").text(); //gets index of option value on selection
    const qval = parseInt($("#questions option:selected").val());
    let qdata;


    let newData = [
      {answers: []},
      {answers: []},
      {answers: []},
      {answers: []},
      {answers: []},
    ]

    if (expVal === "All") {
      newData = data;
    } else {
      const filteredData = _.filter(data[qval].answers, {'experience': expVal});
      newData[qval].answers = filteredData;
    }

    switch(qval) {
      case 1:
        qdata = parseQ1(newData)
        break;
      case 2:
        qdata = parseQ2(newData)
        break;
      case 3:
        qdata = parseQ3(newData)
        break;
      case 4:
        qdata = parseQ4(newData)
        break;
      default:
        "not a valid case"
    }
    drawChart(qdata);
  })
})


function drawChart(data){
  //clears the chart
  console.log(data);
  d3.select('#chart').selectAll("*").remove();

  // Set dimensions
  const paddingAmt = 20;
  const margin = { top: 0, right: 20, bottom: 0, left: 0 };
  let width = $('#chart').width() - margin.left - margin.right;
  let height = margin.top + margin.bottom + (data.length * 25) + (paddingAmt * data.length);

  // Build chart area
  let svg = d3.select('#chart')
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

  // Set scales for each axes
  const x = d3.scaleLinear()
    .range([0, width])
    .domain([0, 100])
  const y = d3.scaleBand()
    .range([height, 0])
    .domain(data.map(function(d) { return d.key; }))


  // Draw bars
  let bar = svg.selectAll(".bar")
    .data(data)
    .enter().append("rect") //this loops thru each data entry
      .attr("class", "bar")
      .attr("x", 0)
      .attr("height",25) // height of bars (otherwise do y.bandwidth())
      .attr("y", d => y(d.key) + 14) //space between text & bar
      .attr("width", 0)
        .transition()
        .duration(500)
        .attr("width", d => x(d.value));

let keyText = svg.selectAll(".keyText")
  .data(data)
  .enter().append("text")
  .attr("class", "keyText")
  .attr("y", d => y(d.key))
  .attr("alignment-baseline", "hanging")
  .text(function(d) { return d.key; });

  let valText = svg.selectAll(".valText")
       .data(data)
       .enter().append("text")
       .attr("class", "valText")
       .attr("x", (d) => (x(d.value) + 5))
      //  {
      //    if (d.value < 90) {
      //      return x(d.value) +5 //space for outside bar
      //    }
      //    else {
      //      return x(d.value) -18 //space for value inside bar
      //    }
      //  })
       .attr("y", d => y(d.key) + 30) //how high/low within bar txt is
       .attr("text-anchor", "right")
       .style("fill", "black")
      //  (d) => {
      //    if (d.value < 10) {
      //      return "black"
      //    }
      //    else {
      //      return "white"
      //    }
      //  })
       .text(function(d) { return d.value; });
  pymChild.sendHeight();

  function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	}
}


  let resize = debounce(function() {
    width = parseInt(d3.select('#chart').style('width'), 10);
    x.range([0, width]);

    svg.selectAll(".bar")
      .attr('width', d => x(d.value));

    svg.selectAll(".valText")
      .attr("x", (d) => (x(d.value) + 5));

    pymChild.sendHeight();

  },150);
  d3.select(window).on('resize', resize);
}


//parsing functions
function parseQ1(data) {
  let i=0;
  let yes=0;
  let no=0;
  console.log(data);
  for(i=0; i<data[1].answers.length; i++) {
    if (data[1].answers[i].answer === "Yes") {
      yes++;
    }
    if (data[1].answers[i].answer === "No") {
      no++;
    }
  }
  let q1results = [{key: "No", value: no}, {key: "Yes", value: yes}];
  console.log(q1results);
  return q1results;
}


function parseQ2(data) {
  let i=0;
  let yes=0;
  let no=0;
  let notseen=0;
  for(i=0; i<data[2].answers.length; i++) {
    if (data[2].answers[i].answer === "Yes") {
      yes++;
    }
    if (data[2].answers[i].answer === "No") {
      no++;
    }
    if (data[2].answers[i].answer === "I've never seen hazing") {
      notseen++;
    }
  }
  let q2results = [{key: "I've never seen hazing", value: notseen}, {key: "No", value: no}, {key: "Yes", value: yes}];
  console.log(q2results);
  return q2results;
}

function parseQ3(data) {
  let i=0;
  let s=0;
  let football=0;
  let basketball=0;
  let baseball=0;
  let volleyball=0;
  let soccer=0;
  let softball=0;
  let wrestling=0;
  let swimdive=0;
  let running=0;
  let tennis=0;
  let golf=0;
  let sports = ["Golf", "Tennis", "Swimming/diving", "Cross Country/Track", "Volleyball", "Softball", "Wrestling", "Soccer", "Basketball", "Baseball", "Football"];
  let sportsvars = [golf, tennis, swimdive, running, volleyball, softball, wrestling, soccer, basketball, baseball, football];
  let na=0;
  let q3results = [];

  for(i=0;i<data[3].answers.length; i++) {
    if (data[3].answers[i].answer === "I have never seen or heard about hazing") {
      na++;
    }
    else {
      for(s=0; s<sports.length; s++) {
        if(data[3].answers[i].answer.includes(sports[s])) {
          sportsvars[s]++;
        }
      }
    }
  }
  const naresult = {"key": "I have never seen or heard about hazing", "value": na};
  q3results.push(naresult);

  let j=0;
  for(j=0;j<sportsvars.length;j++) {
    let result = {"key": sports[j], "value": sportsvars[j]};
    q3results.push(result);
  }
  console.log(q3results);
  return q3results;

}

function parseQ4(data) {
  let i=0;
  let yes=0;
  let no=0;
  let dnr=0;
  for(i=0; i<data[4].answers.length; i++) {
    if (data[4].answers[i].answer === "Yes") {
      yes++;
    }
    if (data[4].answers[i].answer === "No") {
      no++;
    }
    if (data[4].answers[i].answer === "Did not respond") {
      dnr++;
    }
  }
  let q4results = [{key: "Did not respond", value: dnr}, {key: "No", value: no}, {key: "Yes", value: yes}];
  console.log(q4results);
  return q4results;
}

pymChild.sendHeight();

// pour one out for all these archived functions

// a tribute:
// In the arms of the archive
// Fly away from here
// From this dark, cold newsroom
// And the endlessness that you fear
// You are pulled from the wreckage
// Of your silent reverie
// You're in the arms of the archive
// May you find some comfort here

// function filterQ1(data) {
//   let i=0;
//   let exp1_yes=0;
//   let exp2_yes=0;
//   let exp3_yes=0;
//   let exp4_yes=0;
//   let exp5_yes=0;
//   let exp1_no=0;
//   let exp2_no=0;
//   let exp3_no=0;
//   let exp4_no=0;
//   let exp5_no=0;
//
//   for(i=0; i<data[1].answers.length; i++) {
//     if (data[1].answers[i].answer === "Yes") {
//       if(data[1].answers[i].experience === "1-5 years") {
//         exp1_yes++;
//       }
//       if(data[1].answers[i].experience === "6-10 years") {
//         exp2_yes++;
//       }
//       if(data[1].answers[i].experience === "11-20 years") {
//         exp3_yes++;
//       }
//       if(data[1].answers[i].experience === "21-30 years") {
//         exp4_yes++;
//       }
//       if(data[1].answers[i].experience === "More than 30 years") {
//         exp5_yes++;
//       }
//     }
//     if (data[1].answers[i].answer === "No") {
//       if(data[1].answers[i].experience === "1-5 years") {
//         exp1_no++;
//       }
//       if(data[1].answers[i].experience === "6-10 years") {
//         exp2_no++;
//       }
//       if(data[1].answers[i].experience === "11-20 years") {
//         exp3_no++;
//       }
//       if(data[1].answers[i].experience === "21-30 years") {
//         exp4_no++;
//       }
//       if(data[1].answers[i].experience === "More than 30 years") {
//         exp5_no++;
//       }
//     }
//   }
//   let exp1 = [{key: "No", value: exp1_no}, {key: "Yes", value: exp1_yes}];
//   let exp2 = [{key: "No", value: exp2_no}, {key: "Yes", value: exp2_yes}];
//   let exp3 = [{key: "No", value: exp3_no}, {key: "Yes", value: exp3_yes}];
//   let exp4 = [{key: "No", value: exp4_no}, {key: "Yes", value: exp4_yes}];
//   let exp5 = [{key: "No", value: exp5_no}, {key: "Yes", value: exp5_yes}];
//
//   let exp_list = [exp1, exp2, exp3, exp4, exp5];
//   return exp_list;
// }
//
// function filterQ2(data) {
//   let i=0;
//   let exp1_yes=0;
//   let exp2_yes=0;
//   let exp3_yes=0;
//   let exp4_yes=0;
//   let exp5_yes=0;
//   let exp1_no=0;
//   let exp2_no=0;
//   let exp3_no=0;
//   let exp4_no=0;
//   let exp5_no=0;
//   let exp1_dnr=0;
//   let exp2_dnr=0;
//   let exp3_dnr=0;
//   let exp4_dnr=0;
//   let exp5_dnr=0;
//
//   for(i=0; i<data[2].answers.length; i++) {
//     if (data[2].answers[i].answer === "Yes") {
//       if(data[2].answers[i].experience === "1-5 years") {
//         exp1_yes++;
//       }
//       if(data[2].answers[i].experience === "6-10 years") {
//         exp2_yes++;
//       }
//       if(data[2].answers[i].experience === "11-20 years") {
//         exp3_yes++;
//       }
//       if(data[2].answers[i].experience === "21-30 years") {
//         exp4_yes++;
//       }
//       if(data[2].answers[i].experience === "More than 30 years") {
//         exp5_yes++;
//       }
//     }
//     if (data[2].answers[i].answer === "No") {
//       if(data[2].answers[i].experience === "1-5 years") {
//         exp1_no++;
//       }
//       if(data[2].answers[i].experience === "6-10 years") {
//         exp2_no++;
//       }
//       if(data[2].answers[i].experience === "11-20 years") {
//         exp3_no++;
//       }
//       if(data[2].answers[i].experience === "21-30 years") {
//         exp4_no++;
//       }
//       if(data[2].answers[i].experience === "More than 30 years") {
//         exp5_no++;
//       }
//     }
//     if (data[2].answers[i].answer === "Did not respond") {
//       if(data[2].answers[i].experience === "1-5 years") {
//         exp1_dnr++;
//       }
//       if(data[2].answers[i].experience === "6-10 years") {
//         exp2_dnr++;
//       }
//       if(data[2].answers[i].experience === "11-20 years") {
//         exp3_dnr++;
//       }
//       if(data[2].answers[i].experience === "21-30 years") {
//         exp4_dnr++;
//       }
//       if(data[2].answers[i].experience === "More than 30 years") {
//         exp5_dnr++;
//       }
//     }
//   }
//   let exp1 = [{key: "Did not respond", value: exp1_dnr}, {key: "No", value: exp1_no}, {key: "Yes", value: exp1_yes}];
//   let exp2 = [{key: "Did not respond", value: exp2_dnr}, {key: "No", value: exp2_no}, {key: "Yes", value: exp2_yes}];
//   let exp3 = [{key: "Did not respond", value: exp3_dnr}, {key: "No", value: exp3_no}, {key: "Yes", value: exp3_yes}];
//   let exp4 = [{key: "Did not respond", value: exp4_dnr}, {key: "No", value: exp4_no}, {key: "Yes", value: exp4_yes}];
//   let exp5 = [{key: "Did not respond", value: exp5_dnr}, {key: "No", value: exp5_no}, {key: "Yes", value: exp5_yes}];
//
//   let exp_list = [exp1, exp2, exp3, exp4, exp5];
//   return exp_list;
// }
//
// function filterQ3(data) {
//   let i=0;
//   let s=0;
//   let football=0;
//   let basketball=0;
//   let baseball=0;
//   let volleyball=0;
//   let soccer=0;
//   let softball=0;
//   let wrestling=0;
//   let swimdive=0;
//   let running=0;
//   let tennis=0;
//   let golf=0;
//   let sports = ["Golf", "Tennis", "Swimming/diving", "Cross Country/Track", "Volleyball", "Softball", "Wrestling", "Soccer", "Basketball", "Baseball", "Football"];
//   let exp1_sportsvars = [golf, tennis, swimdive, running, volleyball, softball, wrestling, soccer, basketball, baseball, football];
//   let exp2_sportsvars = [golf, tennis, swimdive, running, volleyball, softball, wrestling, soccer, basketball, baseball, football];
//   let exp3_sportsvars = [golf, tennis, swimdive, running, volleyball, softball, wrestling, soccer, basketball, baseball, football];
//   let exp4_sportsvars = [golf, tennis, swimdive, running, volleyball, softball, wrestling, soccer, basketball, baseball, football];
//   let exp5_sportsvars = [golf, tennis, swimdive, running, volleyball, softball, wrestling, soccer, basketball, baseball, football];
//   let exp1_na=0;
//   let exp2_na=0;
//   let exp3_na=0;
//   let exp4_na=0;
//   let exp5_na=0;
//
//
//   for(i=0;i<data[3].answers.length; i++) {
//     if(data[3].answers[i].experience === "1-5 years") {
//       if (data[3].answers[i].answer === "I have never seen or heard about hazing") {
//         exp1_na++;
//       }
//       else {
//         for(s=0; s<sports.length; s++) {
//           if(data[3].answers[i].answer.includes(sports[s])) {
//             exp1_sportsvars[s]++;
//           }
//         }
//       }
//     }
//     if(data[3].answers[i].experience === "6-10 years") {
//       if (data[3].answers[i].answer === "I have never seen or heard about hazing") {
//         exp2_na++;
//       }
//       else {
//         for(s=0; s<sports.length; s++) {
//           if(data[3].answers[i].answer.includes(sports[s])) {
//             exp2_sportsvars[s]++;
//           }
//         }
//       }
//     }
//     if(data[3].answers[i].experience === "11-20 years") {
//       if (data[3].answers[i].answer === "I have never seen or heard about hazing") {
//         exp3_na++;
//       }
//       else {
//         for(s=0; s<sports.length; s++) {
//           if(data[3].answers[i].answer.includes(sports[s])) {
//             exp3_sportsvars[s]++;
//           }
//         }
//       }
//     }
//     if(data[3].answers[i].experience === "21-30 years") {
//       if (data[3].answers[i].answer === "I have never seen or heard about hazing") {
//         exp4_na++;
//       }
//       else {
//         for(s=0; s<sports.length; s++) {
//           if(data[3].answers[i].answer.includes(sports[s])) {
//             exp4_sportsvars[s]++;
//           }
//         }
//       }
//     }
//     if(data[3].answers[i].experience === "More than 30 years") {
//       if (data[3].answers[i].answer === "I have never seen or heard about hazing") {
//         exp5_na++;
//       }
//       else {
//         for(s=0; s<sports.length; s++) {
//           if(data[3].answers[i].answer.includes(sports[s])) {
//             exp5_sportsvars[s]++;
//           }
//         }
//       }
//     }
//   }
//   let exp1 = [];
//   let exp2 = [];
//   let exp3 = [];
//   let exp4 = [];
//   let exp5 = [];
//
//   let exp1_naresult = {"key": "I have never seen or heard about hazing", "value": exp1_na};
//   exp1.push(exp1_naresult);
//   let exp2_naresult = {"key": "I have never seen or heard about hazing", "value": exp2_na};
//   exp2.push(exp2_naresult);
//   let exp3_naresult = {"key": "I have never seen or heard about hazing", "value": exp3_na};
//   exp3.push(exp3_naresult);
//   let exp4_naresult = {"key": "I have never seen or heard about hazing", "value": exp4_na};
//   exp4.push(exp4_naresult);
//   let exp5_naresult = {"key": "I have never seen or heard about hazing", "value": exp5_na};
//   exp5.push(exp5_naresult);
//
//   let j=0;
//   for(j=0;j<exp1_sportsvars.length;j++) {
//     let result = {"key": sports[j], "value": exp1_sportsvars[j]};
//     exp1.push(result);
//   }
//   for(j=0;j<exp2_sportsvars.length;j++) {
//     let result = {"key": sports[j], "value": exp2_sportsvars[j]};
//     exp2.push(result);
//   }
//   for(j=0;j<exp3_sportsvars.length;j++) {
//     let result = {"key": sports[j], "value": exp3_sportsvars[j]};
//     exp3.push(result);
//   }
//   for(j=0;j<exp4_sportsvars.length;j++) {
//     let result = {"key": sports[j], "value": exp4_sportsvars[j]};
//     exp4.push(result);
//   }
//   for(j=0;j<exp5_sportsvars.length;j++) {
//     let result = {"key": sports[j], "value": exp5_sportsvars[j]};
//     exp5.push(result);
//   }
//
//   let exp_list = [exp1, exp2, exp3, exp4, exp5];
//   return exp_list;
// }
//
// function filterQ4(data) {
//   let i=0;
//   let exp1_yes=0;
//   let exp2_yes=0;
//   let exp3_yes=0;
//   let exp4_yes=0;
//   let exp5_yes=0;
//   let exp1_no=0;
//   let exp2_no=0;
//   let exp3_no=0;
//   let exp4_no=0;
//   let exp5_no=0;
//   let exp1_notseen=0;
//   let exp2_notseen=0;
//   let exp3_notseen=0;
//   let exp4_notseen=0;
//   let exp5_notseen=0;
//
//   for(i=0; i<data[2].answers.length; i++) {
//     if (data[2].answers[i].answer === "Yes") {
//       if(data[2].answers[i].experience === "1-5 years") {
//         exp1_yes++;
//       }
//       if(data[2].answers[i].experience === "6-10 years") {
//         exp2_yes++;
//       }
//       if(data[2].answers[i].experience === "11-20 years") {
//         exp3_yes++;
//       }
//       if(data[2].answers[i].experience === "21-30 years") {
//         exp4_yes++;
//       }
//       if(data[2].answers[i].experience === "More than 30 years") {
//         exp5_yes++;
//       }
//     }
//     if (data[2].answers[i].answer === "No") {
//       if(data[2].answers[i].experience === "1-5 years") {
//         exp1_no++;
//       }
//       if(data[2].answers[i].experience === "6-10 years") {
//         exp2_no++;
//       }
//       if(data[2].answers[i].experience === "11-20 years") {
//         exp3_no++;
//       }
//       if(data[2].answers[i].experience === "21-30 years") {
//         exp4_no++;
//       }
//       if(data[2].answers[i].experience === "More than 30 years") {
//         exp5_no++;
//       }
//     }
//     if (data[2].answers[i].answer === "I've never seen hazing") {
//       if(data[2].answers[i].experience === "1-5 years") {
//         exp1_notseen++;
//       }
//       if(data[2].answers[i].experience === "6-10 years") {
//         exp2_notseen++;
//       }
//       if(data[2].answers[i].experience === "11-20 years") {
//         exp3_notseen++;
//       }
//       if(data[2].answers[i].experience === "21-30 years") {
//         exp4_notseen++;
//       }
//       if(data[2].answers[i].experience === "More than 30 years") {
//         exp5_notseen++;
//       }
//     }
//   }
//   let exp1 = [{key: "I've never seen hazing", value: exp1_notseen}, {key: "No", value: exp1_no}, {key: "Yes", value: exp1_yes}];
//   let exp2 = [{key: "I've never seen hazing", value: exp2_notseen}, {key: "No", value: exp2_no}, {key: "Yes", value: exp2_yes}];
//   let exp3 = [{key: "I've never seen hazing", value: exp3_notseen}, {key: "No", value: exp3_no}, {key: "Yes", value: exp3_yes}];
//   let exp4 = [{key: "I've never seen hazing", value: exp4_notseen}, {key: "No", value: exp4_no}, {key: "Yes", value: exp4_yes}];
//   let exp5 = [{key: "I've never seen hazing", value: exp5_notseen}, {key: "No", value: exp5_no}, {key: "Yes", value: exp5_yes}];
//
//   let exp_list = [exp1, exp2, exp3, exp4, exp5];
//   return exp_list;
// }
//
// function parseQ0(data) {
//   let i=0;
//   let exp1=0;
//   let exp2=0;
//   let exp3=0;
//   let exp4=0;
//   let exp5=0;
//   for(i=0; i<data[0].answers.length; i++) {
//     if (data[0].answers[i].answer === "1-5 years") {
//       exp1++;
//     }
//     if (data[0].answers[i].answer === "6-10 years") {
//       exp2++;
//     }
//     if (data[0].answers[i].answer === "11-20 years") {
//       exp3++;
//     }
//     if (data[0].answers[i].answer === "21-30 years") {
//       exp4++;
//     }
//     if (data[0].answers[i].answer === "More than 30 years") {
//       exp5++;
//     }
//   }
//   let q0results = [{key: "1-5 years", value: exp1}, {key: "6-10 years", value: exp2}, {key: "11-20 years", value: exp3}, {key: "21-30 years", value: exp4}, {key: "More than 30 years", value: exp5}];
//   console.log(q0results);
//   return q0results;
// }
//
// function filterQ1(data, expResults) {
//   let j=0;
//   let k=0;
//   let exp1 = [];
//   let exp2 = [];
//   let exp3 = [];
//   let exp4 = [];
//   let exp5 = [];
//
//   for(j=0;j<expResults[0].value.length;j++) {
//     for(k=0;k<data[1].answers.length;k++) {
//       if(expResults[0].value[j] === data[1].answers[k].ID) {
//         exp1.push(data[1].answers[k]);
//       }
//     }
//   }
//   for(j=0;j<expResults[1].value.length;j++) {
//     for(k=0;k<data[1].answers.length;k++) {
//       if(expResults[1].value[j] === data[1].answers[k].ID) {
//         exp2.push(data[1].answers[k]);
//       }
//     }
//   }
//   for(j=0;j<expResults[2].value.length;j++) {
//     for(k=0;k<data[1].answers.length;k++) {
//       if(expResults[2].value[j] === data[1].answers[k].ID) {
//         exp3.push(data[1].answers[k]);
//       }
//     }
//   }
//   for(j=0;j<expResults[3].value.length;j++) {
//     for(k=0;k<data[1].answers.length;k++) {
//       if(expResults[3].value[j] === data[1].answers[k].ID) {
//         exp4.push(data[1].answers[k]);
//       }
//     }
//   }
//   for(j=0;j<expResults[4].value.length;j++) {
//     for(k=0;k<data[1].answers.length;k++) {
//       if(expResults[4].value[j] === data[1].answers[k].ID) {
//         exp5.push(data[1].answers[k]);
//       }
//     }
//   }
//
//
//   console.log(exp1, exp2, exp3, exp4, exp5);
// }
//
//
// function filterExp(data) {
//   let i=0;
//   let exp1_ids=[];
//   let exp2_ids=[];
//   let exp3_ids=[];
//   let exp4_ids=[];
//   let exp5_ids=[];
//   for(i=0; i<data[0].answers.length; i++) {
//     if (data[0].answers[i].answer === "1-5 years") {
//       exp1_ids.push(data[0].answers[i].ID);
//     }
//     if (data[0].answers[i].answer === "6-10 years") {
//       exp2_ids.push(data[0].answers[i].ID);
//     }
//     if (data[0].answers[i].answer === "11-20 years") {
//       exp3_ids.push(data[0].answers[i].ID);
//     }
//     if (data[0].answers[i].answer === "21-30 years") {
//       exp4_ids.push(data[0].answers[i].ID);
//     }
//     if (data[0].answers[i].answer === "More than 30 years") {
//       exp5_ids.push(data[0].answers[i].ID);
//     }
//   }
//   let expResults = [{key: "1-5 years", value: exp1_ids}, {key: "6-10 years", value: exp2_ids}, {key: "11-20 years", value: exp3_ids}, {key: "21-30 years", value: exp4_ids}, {key: "More than 30 years", value: exp5_ids}];
//
//   let j=0;
//   let k=0;
//   let data1 = [];
//
//   for(j=0;j<expResults[0].value.length;j++) {
//     for(k=0;k<data[1].answers.length;k++) {
//       if(expResults[0].value[j] === data[1].answers[k].ID) {
//         data1.push(data[1].answers[k]);
//       }
//     }
//   }
//   return expResults;
// }
