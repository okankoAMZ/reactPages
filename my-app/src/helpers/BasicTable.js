import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import "./table.css"
import {IGNORE_ATTRIBUTES,UNITS} from "../config"
//@TODO ADD UNITS TO TABLE HEADERS
const MIN_COLOUR = 0x50


function getRandomColour(idx){
  var colours = [MIN_COLOUR, MIN_COLOUR,MIN_COLOUR]
  colours[idx%2] =0xCC
  colours[idx%3] = 0xCC
  var stringColour = "#"
  for(var i=0; i< colours.length; i++){
    stringColour+= colours[i].toString(16)
  }
  // console.log(stringColour)
  return stringColour
}
function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
}
  
TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};
  

function CreateRow(props,sigfig,logNum,tps,index) {

    var line = []
    var testMetrics = props.data[Object.keys(props.data)[0]]
    var currMetric = testMetrics[props.metric]
    if (index >= currMetric.length) {
        return []
    }

    var currEntry = currMetric[index]

    line.push(<TableCell class="cell_text"><a href={currEntry["Link"]} target="_blank">
      {currEntry["Hash"]}</a></TableCell>);

    var date = new Date(currEntry["CommitDate"] *1000)
    line.push(<TableCell class="cell_text">{date.toUTCString()}</TableCell>);

    
    var testCases = Object.keys(props.data)

    for (let j = 0; j < testCases.length; j++) {
        let testOptions = testCases[j].split("-")
        if (testOptions[0] == logNum) {
            if (tps == "all" || testOptions[1] == tps) {
                let testMetric = props.data[testCases[j]][props.metric]
                //add line with contained data
                for (let metric in testMetric[index]) {
                    if (IGNORE_ATTRIBUTES.includes(metric) || metric == "Period") {
                        continue;
                    }
                    line.push(<TableCell class="cell_text">{testMetric[index][metric].toPrecision(sigfig)}</TableCell>)
                }
            }
        }
    }

    return line;
}

export function BasicTable(props) {
  // debugger;
    //console.log(props.data)
    document.body.style.setProperty("--tablefontSize",parseInt(props.config.tableFontSize).toString()+"px")
    var metricNames = []
    var metricData = []
    var sigfig = parseInt(props.config.sigfig)
    metricNames.push(<TableCell class="cell_text head">{"Hash"}</TableCell>)
    metricNames.push(<TableCell class="cell_text head">{"CommitDate"}</TableCell>)
    // metricNames.push(<TableCell class="cell_text head">{"Year"}</TableCell>)

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [logNum, setLogNum] = React.useState("10")
    const [tps, setTps] = React.useState("all")

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.data.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    var headerLength = tps == "all" ? 3 : 1
    var testMetrics = props.data[Object.keys(props.data)[0]]
    var currMetric = testMetrics[props.metric]

    for (let i = 0; i < headerLength; i++) {
        for (var metric in currMetric[0]){

            if (IGNORE_ATTRIBUTES.includes(metric) || metric == "Period") {
                continue;
            }

            metricNames.push(<TableCell class="cell_text head">{`${metric} (${UNITS[props.metric]})`}</TableCell>)
        }
    }


    metricNames.push(<TableCell class="cell_text head">Test Selection</TableCell>)

    var labelHeaderClass = tps == "all" ? "table_labels" : "table_labels_hidden"

    var rows = []

    for (let i = page * rowsPerPage; i < page * rowsPerPage + rowsPerPage; i++) {
        var testMetrics = props.data[Object.keys(props.data)[0]]
        var currMetric = testMetrics[props.metric]
        if (i >= currMetric.length) {
            break
        }

        let line = CreateRow(props, sigfig, logNum, tps, i)

        if (i == 0) {
            var options = ["10", "100", "1000"]
            var selectOptions = []
            options.forEach(entry => {
                selectOptions.push(<option>{entry}</option>)
            })
            var label = <label>Log Number</label>
            var br = <br></br>
            var input = <select onChange = {event => setLogNum(event.target.value)}>{selectOptions}</select>
            var testSelection = [label, br, input]
            line.push(<TableCell>{testSelection}</TableCell>)
        } else if (i == 1) {
            var options = ["all", "10", "100", "1000"]
            var selectOptions = []
            options.forEach(entry => {
                selectOptions.push(<option>{entry}</option>)
            })
            var label = <label>TPS</label>
            var br = <br></br>
            var input = <select onChange = {event => setTps(event.target.value)}>{selectOptions}</select>
            var testSelection = [label, br, input]
            line.push(<TableCell>{testSelection}</TableCell>)
        } else {
            line.push(<TableCell></TableCell>)
        }
        
        if (currMetric[i].isRelease) {
            rows.push(<TableRow style ={{background : "#896799" }}>{line}</TableRow>)
        } else {
            rows.push(<TableRow style ={ i % 2 ? {background : "#dddddd" } : { background: "white" }}>{line}</TableRow>)
        }
    }

    return(
        <Container class="table_container">
            <h2>{props.title}</h2>
            <TableContainer component={Paper}>
                <Table aria-label="data table" class="table">
                  
                    <TableHead>
                        <TableRow class={labelHeaderClass}>
                            <TableCell align="center" colSpan={2}>
                                Agent Info
                            </TableCell>
                            <TableCell align="center" colSpan={5}>
                                Low
                            </TableCell>
                            <TableCell align="center" colSpan={5}>
                                Medium
                            </TableCell>
                            <TableCell align="center" colSpan={5}>
                                High
                            </TableCell>
                        </TableRow>
                        <TableRow style={{background:getRandomColour(props.idx), "textAlign": "center"}}>
                            {metricNames}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* {metricData} */}
                        {/* {(rowsPerPage > 0
                            ? props.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : props.data
                        ).map((row, index) => {
                            var line = CreateRow(row,sigfig,logNum,tps)
                            if (index == 0) {
                                var options = ["10", "100", "1000"]
                                var selectOptions = []
                                options.forEach(entry => {
                                    selectOptions.push(<option>{entry}</option>)
                                })
                                var label = <label>Log Number</label>
                                var br = <br></br>
                                var input = <select onChange = {event => setLogNum(event.target.value)}>{selectOptions}</select>
                                var testSelection = [label, br, input]
                                line.push(<TableCell>{testSelection}</TableCell>)
                            } else if (index == 1) {
                                var options = ["all", "10", "100", "1000"]
                                var selectOptions = []
                                options.forEach(entry => {
                                    selectOptions.push(<option>{entry}</option>)
                                })
                                var label = <label>TPS</label>
                                var br = <br></br>
                                var input = <select onChange = {event => setTps(event.target.value)}>{selectOptions}</select>
                                var testSelection = [label, br, input]
                                line.push(<TableCell>{testSelection}</TableCell>)
                            } else {
                                line.push(<TableCell></TableCell>)
                            }
                            return <TableRow style ={ index % 2 ? {background : "#dddddd" } : { background: "white" }}>{line}</TableRow>
                        }
                        )} */}
                        {rows}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter class="table_footer">
                        <TableRow>
                            <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={metricData.length}
                            count={metricData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                'aria-label': 'rows per page',
                                },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Container>
    )
}


export default function TableGroup(props){

    if(props.data === undefined){
        return
    }
    
    var testCase = props.data[Object.keys(props.data)[0]]
    if( testCase === undefined){
        return

    }
    var metrics = Object.keys(testCase)
    var tables = []
    var j=0;
    metrics.forEach(element => {
        tables.push(<BasicTable metric={element} data={props.data} idx = {j} title={element} 
        config={props.config}/>)

        j++;
    })
    return (
        <div id="TableArea" class="table_group">
            {tables}
        </div>
    )
    
}