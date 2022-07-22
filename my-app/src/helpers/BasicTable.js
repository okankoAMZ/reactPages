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
  

function CreateRow(data,sigfig) {
    var line = []
    console.log(data["Hash"])
    line.push(<TableCell class="cell_text"><a href={data["Link"]} target="_blank">
      {data["Hash"]}</a></TableCell>);
    var date = new Date(data["CommitDate"] *1000)
    line.push(<TableCell class="cell_text">{date.toUTCString()}</TableCell>);
    // line.push(<TableCell class="cell_text">{data["Year"]}</TableCell>);

    for (var metric in data) {
        if (metric == "Data" || metric == "Hash" || metric == "CommitDate" || metric == "Year" ||metric == "Link") {
            continue;
        }
        line.push(<TableCell class="cell_text">{data[metric].toPrecision(sigfig)}</TableCell>);
    }
    return line;
}

export function BasicTable(props) {
  // debugger;
    document.body.style.setProperty("--tablefontSize",parseInt(props.config.tableFontSize).toString()+"px")
    var metricNames = []
    var metricData = []
    var sigfig = parseInt(props.config.sigfig)
    metricNames.push(<TableCell class="cell_text head">{"Hash"}</TableCell>)
    metricNames.push(<TableCell class="cell_text head">{"CommitDate"}</TableCell>)
    // metricNames.push(<TableCell class="cell_text head">{"Year"}</TableCell>)

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
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


    

    for (var metric in props.data[0]){
        if (IGNORE_ATTRIBUTES.includes(metric)) {
            continue;
        }

        metricNames.push(<TableCell class="cell_text head">{`${metric} (${UNITS[props.title]})`}</TableCell>)
    }
    return(
        <Container class="table_container">
            <h2>{props.title}</h2>
            <TableContainer component={Paper}>
                <Table aria-label="data table" class="table">
                    <TableHead>
                        <TableRow style={{background:getRandomColour(props.idx), "text-align": "center"}}>
                            {metricNames}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* {metricData} */}
                        {(rowsPerPage > 0
                            ? props.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : props.data
                        ).map((row, index) => (
                            
                            <TableRow style ={ index % 2 ? {background : "#dddddd" } : { background: "white" }}>{CreateRow(row,sigfig)}</TableRow>
                        ))}
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
  var metrics = Object.keys(props.data)
  var tables = []
  var j =0
  if (props.data == undefined){
    return
  }
  metrics.forEach(element => {
      tables.push(<BasicTable data={props.data[element]} idx={j}
         title={element}  config={props.config}/>) // Add a graph
      j++;
  })
  return (
      <div id="TableArea" class="table_group">
          {tables}
      </div>
  )
}