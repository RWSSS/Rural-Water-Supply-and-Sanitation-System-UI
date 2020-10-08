import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from '@material-ui/core/FormControl';
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";

// Generate Order Data
function createData(id, JobCode, Designation, Shift) {
  return { id, JobCode, Designation, Shift };
}

function initializeDB() {
  let newrows = sessionStorage.getItem('Jobs');
  if(newrows) {
    newrows = JSON.parse(newrows);
  }
  else {
    newrows = [
      createData(0, 'J01','Admin','Full-time'),
      createData(1, 'J02','Planning Engineer','Full-time'),
      createData(2, 'J03','Project Manager','Full-time'),
      createData(3, 'J04','Accountant','Full-time'),
      createData(4, 'J05','Electrician','Morning'),
      createData(5, 'J06','Electrician','Evening'),
      createData(6, 'J07','Electrician','Night'),
      createData(7, 'J08','Plumber','Morning'),
      createData(8, 'J09','Plumber','Evening'),
      createData(9, 'J10','Pumber','Night'),
      createData(9, 'J11','House Keeping','Morning'),
      createData(9, 'J12','House Keeping','Evening'),
      createData(9, 'J13','House Keeping','Night'),
    ]
    sessionStorage.setItem('Jobs', JSON.stringify(newrows));
  }
  return newrows;
}

const styles = (theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class Jobs extends React.Component {
  state = {
    rows: initializeDB(),
    showJobs: false,
    showJobsText: "Show Jobs",
    shiftSelect: '',
    open: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    var newrows = this.state.rows;
    newrows.push(
      createData(
        this.state.rows.length,
        e.target.JobCode.value,
        e.target.Designation.value,
        e.target.Shift.value
      )
    );
    this.setState({ ...this.state, rows: newrows, open: true, shiftSelect: '' });
    sessionStorage.setItem('Jobs', JSON.stringify(newrows));
    e.target.reset();
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ ...this.state, open: false });
  };

  renderTable() {
    const { classes } = this.props;
    if (this.state.showJobs) {
      return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  All Jobs
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Job ID</TableCell>
                      <TableCell>Designation</TableCell>
                      <TableCell>Shift</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.JobCode}</TableCell>
                        <TableCell>{row.Designation}</TableCell>
                        <TableCell>{row.Shift}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      );
    }
    return <br />;
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Snackbar
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <SnackbarContent
            style={{
              backgroundColor: "green",
            }}
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={this.handleClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
            message={<span id="client-snackbar">Job Added Successfully!</span>}
          />
        </Snackbar>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Jobs
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="JobCode"
                label="Job Code"
                name="JobCode"
                type="text"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Designation"
                label="Designation"
                type="text"
                id="Designation"
              />
              <FormControl variant="outlined" fullWidth className={classes.form}>
                <InputLabel id="Shift-Label">
                  Shift
                </InputLabel>
                <Select
                  labelId="Shift-Label"
                  id="Shift"
                  label="Shift"
                  name="Shift"
                  variant="outlined"
                  margin="normal"
                  value={this.state.shiftSelect}
                  onChange={(e) => {this.setState({ shiftSelect: e.target.value })}}
                  required
                  fullWidth
                >
                  <MenuItem value={"Full-Time"}>Full Time</MenuItem>
                  <MenuItem value={"Morning"}>Morning Shift</MenuItem>
                  <MenuItem value={"Evening"}>Evening Shift</MenuItem>
                  <MenuItem value={"Night"}>Night Shift</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Add Job
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
                onClick={(e) => {
                  console.log("came in");
                  e.preventDefault();
                  if (!this.state.showJobs)
                    this.setState({
                      ...this.state,
                      showJobs: true,
                      showJobsText: "Hide Jobs",
                    });
                  else
                    this.setState({
                      ...this.state,
                      showJobs: false,
                      showJobsText: "Show Jobs",
                    });
                  console.log(this.state);
                }}
              >
                {this.state.showJobsText}
              </Button>
            </form>
          </div>
        </Container>
        {this.renderTable()}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Jobs);
