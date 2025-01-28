
// import { CssBaseline } from '@mui/material';
// import React, { useState, useEffect, version } from 'react';
// //import { Table, Icon, Segment, Dropdown, Input, Pagination, Popup, Label } from 'semantic-ui-react';

// // import store from '../../stores/PatternExplorerStore';
// // import * as actions from '../../actions/PatternExplorerActions';


// //const LOW_COLOR = '#70c1b3';
// const LOW_COLOR = '#247ba0';
// const HIGH_COLOR = '#f25f5c';
// const RANGE_COLOR = '#ffe066';
// const MESSAGE_COLOR = '#e2dbbe';
// const NORMAL_COLOR = '#7fb069';
// const PAGE_LENGTH = 100;



// // ---------------------------------------------------
// // function to prettify alarm text
// // ---------------------------------------------------
// const generateAlarmTextHTML = function (patternMessage, lowBound, highBound) {
//   let message = patternMessage;
//   let levelText;

//   //strip out HI/LO/NR at end
//   if (message.endsWith('LO')) {
//     levelText = 'LO';
//   } else if (message.endsWith('HI')) {
//     levelText = 'HI';
//   } else if (message.endsWith('NR')) {
//     levelText = 'NR';
//   } else {
//     levelText = null;
//   }

//   message = message.replace(/ HI$/, '');
//   message = message.replace(/ LO$/, '');
//   message = message.replace(/ NR$/, '');

//   //if there are bounds for this alarm, generate the html
//   const levels = typeof lowBound === 'number'
//     ? <span style={{color: RANGE_COLOR}}>&#8712; [{lowBound}, {highBound}]</span>
//     : null;

//   return (
//     <span>
//       <span style={{color: MESSAGE_COLOR}}>{message}</span>
//       {' '}
//       <span style={{color: levelText === 'LO' ? LOW_COLOR : HIGH_COLOR}}>
//         <b>{levelText}</b>
//       </span>
//       {' '}
//       {levels}
//     </span>
//   );
// }

// // ---------------------------------------------------
// // function to prettify lab text
// // ---------------------------------------------------
// const generateLabTextHTML = function (patternMessage, change24h, changeAdmission, discreteLevels) {
//   let message = patternMessage;
//   let levelText;

//   //strip out HI/LO/NR at end
//   if (message.endsWith('LO')) {
//     levelText = 'LO';
//   } else if (message.endsWith('HI')) {
//     levelText = 'HI';
//   } else if (message.endsWith('NR')) {
//     levelText = 'NR';
//   } else {
//     levelText = null;
//   }

//   message = message.replace(/ HI$/, '');
//   message = message.replace(/ LO$/, '');
//   message = message.replace(/ NR$/, '');

//   //inline function for wrapping h/l/n text with the proper color
//   const colorCodeText = function (t) {
//     if (t.startsWith('H')) {
//       return <span style={{color: HIGH_COLOR}}>{t}</span>;
//     } else if (t.startsWith('L')) {
//       return <span style={{color: LOW_COLOR}}>{t}</span>;
//     } else if (t.startsWith('N')) {
//       return <span style={{color: NORMAL_COLOR}}>{t}</span>;
//     } else {
//       return <span style={{color: MESSAGE_COLOR}}>{t}</span>;
//     }
//   };

//   const levels = (
//     <span style={{color: RANGE_COLOR}}>
//       [24h: <b>{colorCodeText(change24h[0])}</b>&#8594;<b>{colorCodeText(change24h[1])}</b>,
//       {' '}Adm: <b>{colorCodeText(changeAdmission[0])}</b>&#8594;<b>{colorCodeText(changeAdmission[1])}</b>]
//     </span>
//   );

//   //create tooltip for normal lab result range
//   const female = discreteLevels.Female;
//   const male = discreteLevels.Male;

//   const femaleRange = typeof female.UpperBound === 'number' || typeof female.UpperBound === 'string'
//     ? (
//       <span>
//         <span style={{color: RANGE_COLOR}}>{female.LowerBound}</span>
//         {' - '}<span style={{color: RANGE_COLOR}}>{female.UpperBound}</span>
//         {' '}<span style={{color: NORMAL_COLOR}}>{female.UnitOfMeasure}</span>
//       </span>
//     ) : (
//       <span>
//         Over <span style={{color: RANGE_COLOR}}>{female.LowerBound}</span>
//         {' '}<span style={{color: NORMAL_COLOR}}>{female.UnitOfMeasure}</span>
//       </span>
//     );

//   const maleRange = typeof male.UpperBound === 'number' || typeof male.UpperBound === 'string'
//     ? (
//       <span>
//         <span style={{color: RANGE_COLOR}}>{male.LowerBound}</span>
//         {' - '}<span style={{color: RANGE_COLOR}}>{male.UpperBound}</span>
//         {' '}<span style={{color: NORMAL_COLOR}}>{male.UnitOfMeasure}</span>
//       </span>
//     ) : (
//       <span>
//         Over <span style={{color: RANGE_COLOR}}>{male.LowerBound}</span>
//         {' '}<span style={{color: NORMAL_COLOR}}>{male.UnitOfMeasure}</span>
//       </span>
//     );

//   let popupMessage;

//   if (
//     female.LowerBound === male.LowerBound
//     && female.UpperBound === male.UpperBound
//     && female.UnitOfMeasure === male.UnitOfMeasure
//   ) {
//     popupMessage = (
//       <span style={{color: MESSAGE_COLOR}}>
//         Normal range:<br />
//         {femaleRange}
//       </span>
//     );
//   } else {
//     popupMessage = (
//       <span style={{color: MESSAGE_COLOR}}>
//         Normal range for <span style={{color: HIGH_COLOR}}>females:</span><br />{femaleRange}
//         <br />
//         Normal range for <span style={{color: LOW_COLOR}}>males:</span><br />{maleRange}
//       </span>
//     );
//   }

//   return (
//     <Popup inverted content={popupMessage} trigger={
//       <span>
//         <span style={{color: MESSAGE_COLOR}}>{message}</span>
//         {' '}<b>{colorCodeText(levelText)}</b>
//         {' '}{levels}
//       </span>
//     } />
//   );
// }

// // ---------------------------------------------------
// // component for model labels, shared between list and histogram view
// // ---------------------------------------------------
// function ModelLabels(props) {
//   return (
//     <span>
//       <Label>Version<Label.Detail>{props.version}</Label.Detail></Label>
//       <Popup inverted content={
//         'Time window for mining co-occurring alarm patterns as SuperAlarm.'
//       } trigger={
//         <Label>Win Length<Label.Detail>{props.winLength}</Label.Detail></Label>
//       } />
//       <Popup inverted content={
//         'Minimum percentage of case samples as lower limit to filter co-occurring alarm patterns as SuperAlarm.'
//       } trigger={
//         <Label>Min Support<Label.Detail>{props.minSupport}</Label.Detail></Label>
//       } />
//       <Popup inverted content={
//         'Maximal percentage of control samples as upper limit to filter co-occurring alarm patterns as SuperAlarm.'
//       } trigger={
//         <Label key={4}>FP Threshold<Label.Detail>
//             {Number.parseFloat(props.fpThreshold).toPrecision(1)}
//         </Label.Detail></Label>
//       } />
//       <Popup inverted content={
//         'Whether to use lab tests in addition to monitor alarms for mining SuperAlarm.'
//       } trigger={
//         <Label>Use Lab<Label.Detail>{props.useLab}</Label.Detail></Label>
//       } />
//       <Popup inverted content={
//         'Total number of SuperAlarm patterns.'
//       } trigger={
//         <Label>Num Patterns<Label.Detail>{props.numPatterns}</Label.Detail></Label>
//       } />
//     </span>
//   );
// }

// const PatternExplorerList = () => {
//   const [state, setState] = useState({
//     page: 1,
//     textSearch: '',
//     numElementsLow: null,
//     numElementsHigh: null,
//     sorting: 'length',
//     patternSelector: [],
//     modelVersions: null,
//     modelInfo: null,
//     versionSelected: 0,
//   });



//   // useEffect(() => {
//   //   store.on('change', getExplorerState);
//   //   actions.getModelVersions();

//   //   return () => {
//   //     store.removeListener('change', getExplorerState);
//   //   };
//   // }, []);

//   useEffect(() => {
//     fetch('./text.txt')
//       .then((response) => response.text())
//       .then((data) => setState((prevState) => ({
//         ...prevState,
//         modelVersions: ['1.1'],
//         modelInfo: [data],
//       })))
//       .catch((error) => console.error('Error fetching the file:', error));
//   }, []);

//   // const getExplorerState = (changeType) => {
//   //   const storeData = store.getData();
//   //   setState((prevState) => ({
//   //     ...prevState,
//   //     modelVersions: storeData.modelVersions,
//   //     modelInfo: storeData.modelInfo,
//   //   }));

//   //   // if we've loaded new versions, select the first one and load it automatically if it isn't already
//   //   if (changeType === 'PATTERN_EXPLORER_VERSIONS') {
//   //     setState((prevState) => ({
//   //       ...prevState,
//   //       versionSelected: 0,
//   //     }));

//   //     if (!storeData.modelInfo[storeData.modelVersions[0]]) {
//   //       actions.getModelInfo(storeData.modelVersions[0]);
//   //     }
//   //   }
//   // };

//   // // cb for version dropdown
//   // const handleVersionChange = (e, { value }) => {
//   //   if (state.versionSelected !== value) {
//   //     setState((prevState) => ({
//   //       ...prevState,
//   //       versionSelected: value,
//   //       page: 1,
//   //     }));

//   //     if (!state.modelInfo[state.modelVersions[value]]) {
//   //       actions.getModelInfo(state.modelVersions[value]);
//   //     }
//   //   }
//   // };

//   // cb for page list
//   const changePage = (e, { activePage }) => {
//     setState((prevState) => ({
//       ...prevState,
//       page: activePage,
//     }));
//     window.scrollTo(0, 0);
//   };

//   // cb for text search filter input
//   const handleTextSearchChange = (e, { value }) => {
//     setState((prevState) => ({
//       ...prevState,
//       textSearch: value,
//       page: 1,
//     }));
//   };

//   // cb for low bound of number elements filter
//   const handleNumElementsChange = (e, { value }) => {
//     const split = value.split('-').map((e) => e.trim());
//     const low = isNaN(parseInt(split[0], 10)) ? null : parseInt(split[0], 10);
//     const high = isNaN(parseInt(split[1], 10)) ? null : parseInt(split[1], 10);

//     if (state.numElementsLow !== low || state.numElementsHigh !== high) {
//       setState((prevState) => ({
//         ...prevState,
//         numElementsLow: low,
//         numElementsHigh: high,
//         page: 1,
//       }));
//     }
//   };

//   // cbs for sorting icons
//   // sorting codes: length, fpasc, fpdesc, tpasc, tpdesc
//   const handleFPSort = () => {
//     setState((prevState) => ({
//       ...prevState,
//       sorting:
//         prevState.sorting === 'fpasc'
//           ? 'fpdesc'
//           : prevState.sorting === 'fpdesc'
//           ? 'length'
//           : 'fpasc',
//     }));
//   };

//   const handleTPSort = () => {
//     setState((prevState) => ({
//       ...prevState,
//       sorting:
//         prevState.sorting === 'tpasc'
//           ? 'tpdesc'
//           : prevState.sorting === 'tpdesc'
//           ? 'length'
//           : 'tpasc',
//     }));
//   };

//   // cb for handling the element type dropdown change
//   const handleElementTypeChange = (e, { value }) => {
//     setState((prevState) => ({
//       ...prevState,
//       patternSelector: value,
//       page: 1,
//     }));
//   };

//   // function to apply user filters to patterns
//   const getFilteredPatterns = () => {
//     const versionSelected = Array.isArray(state.modelVersions)
//       ? state.modelVersions[state.versionSelected]
//       : null;

//     // check if selected version is loaded
//     if (versionSelected && state.modelInfo/[versionSelected]) {
//       const patternInfo = state.modelInfo;
//       let patterns = state.modelInfo[versionSelected].slice();

//       // filter based on number of patterns
//       const low = state.numElementsLow;
//       const high = state.numElementsHigh;

//       if (low !== null) {
//         patterns = patterns.filter((e) => {
//           if (high === null) {
//             return e.Pattern.length === low;
//           } else {
//             return e.Pattern.length >= low && e.Pattern.length <= high;
//           }
//         });
//       }

//       // filter based on search field
//       const textSearch = state.textSearch.trim();

//       if (textSearch.length > 0) {
//         // find SACodes with search text included
//         const includedSACodes = patternInfo.PatternLevels
//           .filter((e) => e.SAMessage.toLowerCase().includes(textSearch.toLowerCase()))
//           .map((e) => e.SACode);

//         // filter patterns that don't include those SACodes
//         patterns = patterns.filter((e) => {
//           let found = false;

//           for (let i = 0; i < e.Pattern.length; i++) {
//             const currentElement = e.Pattern[i];

//             if (
//               includedSACodes.includes(Array.isArray(currentElement) ? currentElement[0] : currentElement)
//             ) {
//               found = true;
//               break;
//             }
//           }

//           return found;
//         });
//       }

//       // filter based on element types
//       if (state.patternSelector.find((e) => e === 'labs')) {
//         const includedSACodes = patternInfo.PatternLevels
//           .filter((e) => e.DataModality === 'lab')
//           .map((e) => e.SACode);

//         patterns = patterns.filter((e) => {
//           let found = false;

//           for (let i = 0; i < e.Pattern.length; i++) {
//             const currentElement = e.Pattern[i];

//             if (
//               includedSACodes.includes(Array.isArray(currentElement) ? currentElement[0] : currentElement)
//             ) {
//               found = true;
//               break;
//             }
//           }

//           return found;
//         });
//       } else if (state.patternSelector.find((e) => e === 'without labs')) {
//         const includedSACodes = patternInfo.PatternLevels
//           .filter((e) => e.DataModality === 'lab')
//           .map((e) => e.SACode);

//         patterns = patterns.filter((e) => {
//           let found = false;

//           for (let i = 0; i < e.Pattern.length; i++) {
//             const currentElement = e.Pattern[i];

//             if (
//               includedSACodes.includes(Array.isArray(currentElement) ? currentElement[0] : currentElement)
//             ) {
//               found = true;
//               break;
//             }
//           }

//           return !found;
//         });
//       }

//       if (state.patternSelector.find((e) => e === 'parametric alarms')) {
//         const includedSACodes = patternInfo.PatternLevels
//           .filter((e) => e.DataModality === 'alarm' && e.IsParametric === 1)
//           .map((e) => e.SACode);

//         patterns = patterns.filter((e) => {
//           let found = false;

//           for (let i = 0; i < e.Pattern.length; i++) {
//             const currentElement = e.Pattern[i];

//             if (
//               includedSACodes.includes(Array.isArray(currentElement) ? currentElement[0] : currentElement)
//             ) {
//               found = true;
//               break;
//             }
//           }

//           return found;
//         });
//       }

//       if (state.patternSelector.find((e) => e === 'arrhythmia alarms')) {
//         const includedSACodes = patternInfo.PatternLevels
//           .filter((e) => e.DataModality === 'alarm' && e.IsArrhythmia === 1)
//           .map((e) => e.SACode);

//         patterns = patterns.filter((e) => {
//           let found = false;

//           for (let i = 0; i < e.Pattern.length; i++) {
//             const currentElement = e.Pattern[i];

//             if (
//               includedSACodes.includes(Array.isArray(currentElement) ? currentElement[0] : currentElement)
//             ) {
//               found = true;
//               break;
//             }
//           }

//           return found;
//         });
//       }

//       if (state.patternSelector.find((e) => e === 'other alarms')) {
//         const includedSACodes = patternInfo.PatternLevels
//           .filter((e) => e.DataModality === 'alarm' && e.IsArrhythmia === 0 && e.IsParametric === 0)
//           .map((e) => e.SACode);

//         patterns = patterns.filter((e) => {
//           let found = false;

//           for (let i = 0; i < e.Pattern.length; i++) {
//             const currentElement = e.Pattern[i];

//             if (
//               includedSACodes.includes(Array.isArray(currentElement) ? currentElement[0] : currentElement)
//             ) {
//               found = true;
//               break;
//             }
//           }

//           return found;
//         });
//       }

//       // sort patterns
//       let compareFunc;

//       switch (state.sorting) {
//         case 'length':
//           compareFunc = (a, b) => {
//             if (a.Pattern.length < b.Pattern.length) {
//               return -1;
//             } else if (a.Pattern.length > b.Pattern.length) {
//               return 1;
//             } else {
//               return 0;
//             }
//           };
//           break;
//         case 'fpasc':
//           compareFunc = (a, b) => {
//             if (a.FP < b.FP) {
//               return -1;
//             } else if (a.FP > b.FP) {
//               return 1;
//             } else {
//               return 0;
//             }
//           };
//           break;
//         case 'fpdesc':
//           compareFunc = (a, b) => {
//             if (a.FP > b.FP) {
//               return -1;
//             } else if (a.FP < b.FP) {
//               return 1;
//             } else {
//               return 0;
//             }
//           };
//           break;
//         case 'tpasc':
//           compareFunc = (a, b) => {
//             if (a.TP < b.TP) {
//               return -1;
//             } else if (a.TP > b.TP) {
//               return 1;
//             } else {
//               return 0;
//             }
//           };
//           break;
//         case 'tpdesc':
//           compareFunc = (a, b) => {
//             if (a.TP > b.TP) {
//               return -1;
//             } else if (a.TP < b.TP) {
//               return 1;
//             } else {
//               return 0;
//             }
//           };
//           break;
//         default:
//           // nada
//       }

//       console.log("patterns: ", patterns);
//       // patterns.sort(compareFunc);

//       return patterns;
//     } else {
//       // if version is not loaded
//       return null;
//     }
//   };

//   // check if we've loaded versions
//   if (Array.isArray(state.modelVersions) && state.modelVersions.length > 0) {
//     console.log('I am here');
//     let patternList;
//     let modelParameterLabels;
//     let totalPages = 0;
//     const patterns = getFilteredPatterns();

//     let versionSelected = Array.isArray(state.modelVersions)
//       ? state.modelVersions[state.versionSelected]
//       : null;

//     // check if selected version is loaded
//     if (versionSelected && state.modelInfo[versionSelected] && patterns !== null) {
//       let patternInfo = state.modelInfo[versionSelected];

//       totalPages = Math.ceil(patterns.length / PAGE_LENGTH);

//       modelParameterLabels = (
//         <ModelLabels
//           version={patternInfo.Parameters.Version}
//           winLength={patternInfo.Parameters.WinLength}
//           minSupport={patternInfo.Parameters.MinSupport}
//           fpThreshold={patternInfo.Parameters.FPThreshold}
//           useLab={patternInfo.Parameters.UseLab}
//           numPatterns={patternInfo.Parameters.NumPatterns}
//         />
//       );

//       // find longest pattern
//       let longestLength = 0;

//       for (let i = 0; i < patterns.length; i++) {
//         if (longestLength < patterns[i].Pattern.length) {
//           longestLength = patterns[i].Pattern.length;
//         }
//       }

//       // set proper sort icons
//       let fpSortIcon = 'sort';
//       let tpSortIcon = 'sort';

//       if (state.sorting === 'tpasc') {
//         tpSortIcon = 'triangle up';
//       } else if (state.sorting === 'tpdesc') {
//         tpSortIcon = 'triangle down';
//       } else if (state.sorting === 'fpasc') {
//         fpSortIcon = 'triangle up';
//       } else if (state.sorting === 'fpdesc') {
//         fpSortIcon = 'triangle down';
//       }

//       // render header row for the table
//       let headerCells = [
//         <Table.HeaderCell key={-2}>
//           FP<Icon name={fpSortIcon} onClick={handleFPSort} style={{ cursor: 'pointer' }} />
//         </Table.HeaderCell>,
//         <Table.HeaderCell key={-1}>
//           TP<Icon name={tpSortIcon} onClick={handleTPSort} style={{ cursor: 'pointer' }} />
//         </Table.HeaderCell>,
//       ];

//       for (let i = 0; i < longestLength; i++) {
//         headerCells.push(<Table.HeaderCell key={i}>Element #{i + 1}</Table.HeaderCell>);
//       }

//       // render table's body rows
//       let bodyRows = [];

//       for (
//         let i = 0;
//         i < PAGE_LENGTH && (state.page - 1) * PAGE_LENGTH + i < patterns.length;
//         i++
//       ) {
//         const index = (state.page - 1) * PAGE_LENGTH + i;
//         let cells = [
//           // turn decimal values to percents, round to 2 decimal places
//           <Popup
//             inverted
//             key={-2}
//             content={patterns[index].FP * 100 + '%'}
//             trigger={
//               <Table.Cell style={{ color: RANGE_COLOR }}>
//                 {Math.round(patterns[index].FP * 10000) / 100}%
//               </Table.Cell>
//             }
//           />,
//           <Popup
//             inverted
//             key={-1}
//             content={patterns[index].TP * 100 + '%'}
//             trigger={
//               <Table.Cell style={{ color: RANGE_COLOR }}>
//                 {Math.round(patterns[index].TP * 10000) / 100}%
//               </Table.Cell>
//             }
//           />,
//         ];

//         for (let j = 0; j < longestLength; j++) {
//           // make sure pattern is in an array for convenience
//           const pattern = Array.isArray(patterns[index].Pattern[j])
//             ? patterns[index].Pattern[j]
//             : [patterns[index].Pattern[j]];

//           if (pattern[0] !== null && typeof pattern[0] !== 'undefined') {
//             const patternWithLevels = patternInfo.PatternLevels.find((e) => e.SACode === pattern[0]);
//             const message = patternWithLevels.SAMessage;

//             cells.push(
//               <Table.Cell key={j}>
//                 {patternWithLevels.DataModality === 'lab'
//                   ? generateLabTextHTML(
//                       message,
//                       patternWithLevels.Change24h,
//                       patternWithLevels.ChangeAdmission,
//                       patternWithLevels.DiscreteLevels
//                     )
//                   : generateAlarmTextHTML(message, pattern[1], pattern[2])}
//               </Table.Cell>
//             );
//           } else {
//             cells.push(<Table.Cell key={j} />);
//           }
//         }

//         bodyRows.push(<Table.Row key={i}>{cells}</Table.Row>);
//       }

//       patternList = (
//         <Table celled inverted striped>
//           <Table.Header>
//             <Table.Row>{headerCells}</Table.Row>
//           </Table.Header>

//           <Table.Body>{bodyRows}</Table.Body>
//         </Table>
//       );
//     } else {
//       // if selected version is still loading
//       patternList = 'Patterns loading...';
//     }

//     let patternSelectorOptions = [
//       { key: 'parametric alarms', text: 'Parametric Alarms', value: 'parametric alarms' },
//       { key: 'arrhythmia alarms', text: 'Arrhythmia Alarms', value: 'arrhythmia alarms' },
//       { key: 'other alarms', text: 'Other Alarms', value: 'other alarms' },
//     ];

//     if (!state.patternSelector.find((e) => e === 'labs')) {
//       patternSelectorOptions.push({ key: 'without labs', text: 'Without Labs', value: 'without labs' });
//     }

//     if (!state.patternSelector.find((e) => e === 'without labs')) {
//       patternSelectorOptions.push({ key: 'labs', text: 'With Labs', value: 'labs' });
//     }

//     console.log('state', state);


//     return (
//       <>
//       <CssBaseline />
//       <Segment style={{ backgroundColor: '#333333', color: 'white', marginTop: '0px' }}>
//   <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//     <Dropdown
//       placeholder='Version'
//       selection
//       options={state.modelVersions.map((e, i) => ({ key: i, text: e, value: i }))}
//       value={state.versionSelected}
//       // onChange={handleVersionChange}
//     />
//     <Input
//       icon='search'
//       onChange={handleTextSearchChange}
//       placeholder='Search'
//       inverted
//     />
//     <Input
//       icon='hashtag'
//       onChange={handleNumElementsChange}
//       placeholder='Pattern length ex. 2-4'
//       inverted
//     />
//     <Dropdown
//       multiple
//       selection
//       placeholder='Pattern selector'
//       options={patternSelectorOptions}
//       onChange={handleElementTypeChange}
//       value={state.patternSelector}
//       style={{ marginLeft: '10px' }}
//     />
//   </div>
  
//   {modelParameterLabels && (
//     <div style={{ marginBottom: '20px' }}>
//       {modelParameterLabels}
//     </div>
//   )}

//   <center>
//     <Pagination
//       activePage={state.page}
//       boundaryRange={1}
//       onPageChange={changePage}
//       size='mini'
//       siblingRange={3}
//       totalPages={totalPages}
//       firstItem={null}
//       lastItem={null}
//       prevItem={null}
//       nextItem={null}
//       inverted
//     />
//   </center>

//   {patternList}

//   <center>
//     <Pagination
//       activePage={state.page}
//       boundaryRange={1}
//       onPageChange={changePage}
//       size='mini'
//       siblingRange={3}
//       totalPages={totalPages}
//       firstItem={null}
//       lastItem={null}
//       prevItem={null}
//       nextItem={null}
//       inverted
//     />
//   </center>
// </Segment>

//       </>
//    );

//   } else {
//     // if possible versions are still loading
//     return <Dropdown disabled selection placeholder='Version' loading options={[]} />;
//   }
// };

// export default PatternExplorerList;
