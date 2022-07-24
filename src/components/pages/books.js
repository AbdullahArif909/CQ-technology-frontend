import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
// Icons
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";

import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
  selectTableCell: {
    width: 60,
  },
  tableCell: {
    width: 130,
    height: 40,
  },
  input: {
    width: 130,
    height: 40,
  },
}));

const createData = (
  student_id,
  id,
  firstname,
  name,
  author,
  date_of_borrow,
  date_of_return
) => ({
  student_id: student_id,
  id,
  firstname,
  name,
  author,
  date_of_borrow,
  date_of_return,
  isEditMode: false,
});

function populateBooks(books) {
  var arr = [];
  for (let i = 0; i < books.length; i++) {
    // createData(books[i].firstname, books[i].name, books[i].author, books[i].date_of_borrow, books[i].date_of_return);
    // console.log(books[i].id);
    if (books[i].date_of_borrow === null && books[i].date_of_return === null) {
      arr.push(
        createData(
          books[i].firstname,
          books[i].id,
          books[i].firstname,
          books[i].name,
          books[i].author,
          null,
          null
        )
      );
    } else if (books[i].date_of_borrow === null) {
      arr.push(
        createData(
          books[i].firstname,
          books[i].id,
          books[i].firstname,
          books[i].name,
          books[i].author,
          null,
          moment(books[i].date_of_return).format("DD MMM, YYYY")
        )
      );
    } else if (books[i].date_of_return === null) {
      arr.push(
        createData(
          books[i].firstname,
          books[i].id,
          books[i].firstname,
          books[i].name,
          books[i].author,
          moment(books[i].date_of_borrow).format("DD MMM, YYYY"),
          null
        )
      );
    } else {
      arr.push(
        createData(
          books[i].firstname,
          books[i].id,
          books[i].firstname,
          books[i].name,
          books[i].author,
          moment(books[i].date_of_borrow).format("DD MMM, YYYY"),
          moment(books[i].date_of_return).format("DD MMM, YYYY")
        )
      );
    }
  }
  return arr;
}

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  var inputDisable;
  var edit;
  var row_name;
  if (name === "id") {
    inputDisable = true;
  } else {
    inputDisable = false;
  }

  if (name === "student_id") {
    edit = "Enter Student ID";
    // row_name = "";
  } else {
    edit = "";
    row_name = row[name];
  }
  return (
    <TableCell align="left" className={classes.tableCell}>
      {isEditMode ? (
        <Input
          placeholder={edit}
          disabled={inputDisable}
          value={row_name}
          name={name}
          onChange={(e) => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        row[name]
      )}
    </TableCell>
  );
};

function Books() {
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    fetch("http://localhost:5000/book", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((messages) => {
        console.log(messages);
        setRows(populateBooks(messages));
      });
  }, []);

  function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
  }
  function updateBooks(params) {
    console.log(params);
    // console.log(params);
    params.date_of_borrow = moment(params.date_of_borrow).format(
      "DD MM YYYY hh:mm:ss"
    );
    params.date_of_return = moment(params.date_of_return).format(
      "DD MM YYYY hh:mm:ss"
    );
    if (containsAnyLetter(params.student_id)) {
      delete params.student_id;
    }
    console.log(params);
    fetch("http://localhost:5000/updateBooks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify(params),
    });
    onToggleEditMode(params.id);
    window.location.reload(false);
  }

  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();

  const onToggleEditMode = (id) => {
    setRows((state) => {
      return rows.map((row) => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const onRevert = (id) => {
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return previous[id] ? previous[id] : row;
      }
      return row;
    });
    setRows(newRows);
    setPrevious((state) => {
      delete state[id];
      return state;
    });
    onToggleEditMode(id);
  };

  return (
    <>
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="caption table">
          <caption>View/Edit Books</caption>
          <TableHead>
            <TableRow>
              <TableCell align="left" />
              <TableCell align="left">Book ID</TableCell>
              <TableCell align="left">Student Name</TableCell>
              <TableCell align="left">Book Name</TableCell>
              <TableCell align="left">Author Name</TableCell>
              <TableCell align="left">Date of Borrow</TableCell>
              <TableCell align="left">Expected Date of Return</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className={classes.selectTableCell}>
                  {row.isEditMode ? (
                    <>
                      <IconButton
                        aria-label="done"
                        onClick={() =>
                          updateBooks({
                            id: row.id,
                            student_id: row.student_id,
                            name: row.name,
                            author: row.author,
                            date_of_borrow: row.date_of_borrow,
                            date_of_return: row.date_of_return,
                          })
                        }
                      >
                        <DoneIcon />
                      </IconButton>
                      <IconButton
                        aria-label="revert"
                        onClick={() => onRevert(row.id)}
                      >
                        <RevertIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      aria-label="delete"
                      onClick={() => onToggleEditMode(row.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
                <CustomTableCell {...{ row, name: "id", onChange }} />
                <CustomTableCell {...{ row, name: "student_id", onChange }} />
                <CustomTableCell {...{ row, name: "name", onChange }} />
                <CustomTableCell {...{ row, name: "author", onChange }} />
                <CustomTableCell
                  {...{ row, name: "date_of_borrow", onChange }}
                />
                <CustomTableCell
                  {...{ row, name: "date_of_return", onChange }}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}

export default Books;
