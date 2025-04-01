/**
 *
 */

//
function calculateConceptAgreement(values) {
  let max = 0;
  let sum = 0;
  let aggregatedResults = [];
  let average = (array) => array.reduce((a, b) => a + b) / array.length;
  for (let val in values) {
    max = Math.max(...Object.values(values[val]));
    sum = Object.values(values[val]).reduce(
      (partialSum, a) => partialSum + a,
      0
    );
    let percentage = Math.round((max / sum) * 100);
    aggregatedResults.push(percentage);
  }
  return parseInt(average(aggregatedResults), 10);
}

// const flatten = (arr) => arr.reduce((flat, next) => flat.concat(next), []);

// function getMap(paths) {
//   let treePath = {};
//   paths.forEach((p) => {
//     if (p.indexOf('.') !== 0 && p.slice(-7) === '.adibin') {
//       let levels = p.split('/');
//       let file = levels.pop();
//       let prevLevel = treePath;
//       let prevProp = levels.shift();

//       levels.forEach((prop) => {
//         prevLevel[prevProp] = prevLevel[prevProp] || {};
//         prevLevel = prevLevel[prevProp];
//         prevProp = prop;
//       });

//       prevLevel[prevProp] = (prevLevel[prevProp] || []).concat([file]);
//     }
//   });

//   return treePath;
// }

//
export const calculateAnnotationValues = (annotations) => {
  let organizedValues = {};
  let calculatedAgreement = {};

  //console.log("annotations: ", annotations);
  for (let index in annotations) {
    let nId = annotations[index].id;
    organizedValues[nId] = {};
    calculatedAgreement[nId] = {};

    for (let userIndex in annotations[index].cadaAnnotations) {
      let userValues = annotations[index].cadaAnnotations[userIndex];
      let uId = userValues.userId;
      //console.log("uId:", uId);
      if (userValues.cadaAnnotationValues.length > 0) {
        for (let valuesIndex in userValues.cadaAnnotationValues) {
          let val = userValues.cadaAnnotationValues[valuesIndex];
          let cId = val.field;
          if (organizedValues[nId][cId]) {
            if (organizedValues[nId][cId][uId]) {
              organizedValues[nId][cId][uId] =
                organizedValues[nId][cId][uId][val.id] > val.id
                  ? organizedValues[nId][cId][uId]
                  : { value: val.value };
            } else {
              organizedValues[nId][cId][uId] = { value: val.value };
            }
          } else {
            organizedValues[nId][cId] = { [uId]: { value: val.value } };
          }
        }
      }
    }
    // console.log("organizedValues: ", organizedValues);
    for (let cId in organizedValues[nId]) {
      let values = {};
      calculatedAgreement[nId][cId] = {};
      let temp = organizedValues[nId][cId];
      for (let user in temp) {
        let json = JSON.parse(temp[user].value);
        for (let fieldname in json) {
          if (fieldname in values) {
            values[fieldname].push(json[fieldname]);
          } else {
            values[fieldname] = [json[fieldname]];
          }
        }
      }
      //group array to get count for each annotation value
      for (let classifier in values) {
        values[classifier] = values[classifier].reduce(
          (a, c) => ((a[c] = (a[c] || 0) + 1), a),
          Object.create(null)
        );
      }
      calculatedAgreement[nId][cId] = [
        values,
        calculateConceptAgreement(values),
        organizedValues[nId][cId],
      ];
    }
  }
  return calculatedAgreement;
};

// set color based on adjudication agreement percentile
export const percentageColor = (percentage) => {
  if (percentage <= 50 && percentage > 0)
    return { label: "Poor", color: "#b8e994" };
  if (percentage <= 60 && percentage > 50)
    return { label: "Weak", color: "#78e08f" };
  if (percentage <= 70 && percentage > 60)
    return { label: "Normal", color: "#38ada9" };
  if (percentage <= 80 && percentage > 70)
    return { label: "Good", color: "#079992" };
  if (percentage > 80) return { label: "Strong", color: "#f6b93b" };
  return { label: "Poor", color: "#b8e994" };
};

export const getAnnotatedEvents = (events) => {
  let ann = {};
  for (let i = 0; i < events.length; i++) {
    ann[events[i].id] = {};
    for (let k = 0; k < events[i].cadaAnnotations.length; k++) {
      if (
        events[i].cadaAnnotations[k].completed === true &&
        events[i].cadaAnnotations[k].cadaAnnotationValues.length > 0
      ) {
        //find last annotation value object
        let lastAnnotationValueObject =
          events[i].cadaAnnotations[k].cadaAnnotationValues[
            events[i].cadaAnnotations[k].cadaAnnotationValues.length - 1
          ];
        if (ann[events[i].id][lastAnnotationValueObject.value]) {
          // check if events[i].cadaAnnotations[k].userId already exits
          if (
            ann[events[i].id][lastAnnotationValueObject.value].includes(
              events[i].cadaAnnotations[k].userId
            )
          ) {
            continue;
          } else {
            ann[events[i].id][lastAnnotationValueObject.value].push(
              events[i].cadaAnnotations[k].userId
            );
          }
        } else {
          ann[events[i].id][lastAnnotationValueObject.value] = [
            events[i].cadaAnnotations[k].userId,
          ];
        }
      }
    }
  }
  return ann;
};

export const getAdjudicatedEvents = (events) => {
  let adj = {};
  for (let i = 0; i < events.length; i++) {
    adj[i] = {};
    if (events[i].cadaAdjudicationValues.length > 0) {
      for (let j = 0; j < events[i].cadaAdjudicationValues.length; j++) {
        adj[i][events[i].cadaAdjudicationValues[j].field] = {
          ...JSON.parse(events[i].cadaAdjudicationValues[j].value),
          userId: events[i].cadaAdjudicationValues[j].userId,
        };
      }
    }
  }
  return adj;
};
