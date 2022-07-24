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

const createData = (id, firstname, lastname) => ({
  id: id,
  firstname,
  lastname,
  isEditMode: false,
});

function populateStudents(students) {
  var arr = [];
  for (let i = 0; i < students.length; i++) {
    createData(students[i].id, students[i].firstname, students[i].lastname);
    console.log(students[i].firstname);
    arr.push(
      createData(students[i].id, students[i].firstname, students[i].lastname)
    );
  }
  return arr;
}

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  var inputDisable;
  if (name === "id") {
    inputDisable = true;
  } else {
    inputDisable = false;
  }
  return (
    <TableCell align="left" className={classes.tableCell}>
      {isEditMode ? (
        <Input
          disabled={inputDisable}
          value={row[name]}
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

function Students() {
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    fetch("http://localhost:5000/students", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((messages) => {
        console.log(messages);
        setRows(populateStudents(messages));
      });
  }, []);

  function updateStudents(params) {
    console.log(params);
    fetch("http://localhost:5000/updateStudents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify(params),
    });
    onToggleEditMode(params.id);
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
          <caption>View/Edit Students</caption>
          <TableHead>
            <TableRow>
              <TableCell align="left" />
              <TableCell align="left">Student ID</TableCell>
              <TableCell align="left">First Name</TableCell>
              <TableCell align="left">Last Name</TableCell>
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
                          updateStudents({
                            id: row.id,
                            firstname: row.firstname,
                            lastname: row.lastname,
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
                <CustomTableCell {...{ row, name: "firstname", onChange }} />
                <CustomTableCell {...{ row, name: "lastname", onChange }} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}

export default Students;
