import React, { Component } from "react";
import axios from 'axios';
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
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from "@material-ui/core/styles";

import Header from "../components/Header";

async function fetchDB() {
  let resdata = [];
  await axios.get(`http://localhost:3001/api/location/getalllocations`)
      .then(res => {
        resdata = res.data.result;
      })
      .catch(err => {
        console.log(err);
      });
  return resdata;
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
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: 'white',
    position: 'absolute',
    top: '55%',
    left: '85%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class Location extends React.Component {
  state = {
    rows: [],
    showLocation: false,
    showLocationText: "Show Location",
    loading: false,
    snackbarMessage: "",
    Token: null,
    snackbarColor: "",
    val: {
      Pincode: "",
      District: "",
      Panchayat: ""
    },
    open: false,
  };

  async componentDidMount() {
    let Token = sessionStorage.getItem("Token");
    if (!Token || Token.length === 0) {
      this.setState({
        ...this.state,
        snackbarMessage: "Please Login First!!!",
        open: true,
        snackbarColor: "red",
      });
      let self = this;
      setTimeout(function () {
        self.props.history.push("/");
      }, 500);
    }
    await this.setState({ Token });
    let Designation = sessionStorage.getItem("Designation");
    if (Designation !== "Admin") {
      this.setState({
        ...this.state,
        snackbarMessage: "Login as Admin First!!!",
        open: true,
        snackbarColor: "red",
      });
      let self = this;
      setTimeout(function () {
        self.props.history.push("/Dashboard");
      }, 500);
    }
    let newrows = await fetchDB();    
    this.setState({ rows: newrows });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    e.persist();
    for(let txt of Object.values(this.state.val)) {
      if(txt.length > 0) {
        this.setState({ open: true, snackbarMessage: "Invalid Values!", snackbarColor: "red" });
        return;
      }
    }
    let ev = e;
    this.setState({ loading: true });
    axios.post(`http://localhost:3001/api/location/addlocation`, { Pincode: e.target.Pincode.value, Panchayat: e.target.Panchayat.value, District: e.target.District.value }, { headers: { Authorization: "Bearer " + this.state.Token } })
      .then(async (res) => {
        let newrows = await fetchDB();
        this.setState({ ...this.state, rows: newrows, snackbarMessage: res.data.message, open: true, snackbarColor: "green" });
        ev.target.reset();
      })
      .catch(err => {
        console.log(err);
        this.setState({ ...this.state, open: true, snackbarMessage: err.response.data.message, snackbarColor: "red" });
      });   
    this.setState({ loading: false });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ ...this.state, open: false });
  };

  renderTable() {
    const { classes } = this.props;
    if (this.state.showLocation) {
      return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  All Location
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Pincode</TableCell>
                      <TableCell>Panchayat</TableCell>
                      <TableCell>District</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={row.Pincode}>
                        <TableCell>{row.Pincode}</TableCell>
                        <TableCell>{row.Panchayat}</TableCell>
                        <TableCell>{row.District}</TableCell>
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
        <Header />
        <Snackbar
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <SnackbarContent
            style={{
              backgroundColor: this.state.snackbarColor,
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
          message={<span id="client-snackbar">{this.state.snackbarMessage}</span>}
          />
        </Snackbar>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Location
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="Pincode"
                label="Pincode"
                name="Pincode"
                type="number"
                error={(this.state.val.Pincode.length === 0)? false : true}
                helperText={this.state.val.Pincode}
                onChange={(e) => {
                  let val = this.state.val;
                  var format = /[0-9]+/;
                  if (!format.test(e.target.value) || e.target.value.length !== 6) val.Pincode = "Pincode must be of 6 digits and can't contain a character";            
                  else val.Pincode = "";
                  this.setState({ val });
                }}   
                error={(this.state.val.Pincode.length === 0)? false : true}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Panchayat"
                label="Panchayat"
                type="text"
                id="Panchayat"
                helperText={this.state.val.Panchayat}
                onChange={(e) => {
                  let val = this.state.val;
                  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]+/;
                  if (format.test(e.target.value)) val.Panchayat = "Panchayat name cannot contain special symbols";            
                  else val.Panchayat = "";
                  this.setState({ val });
                }}
                error={(this.state.val.Panchayat.length === 0)? false : true}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="District"
                label="District"
                type="text"
                id="District"
                error={(this.state.val.District.length === 0)? false : true}
                helperText={this.state.val.District}
                onChange={(e) => {
                  let val = this.state.val;
                  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]+/;
                  if (format.test(e.target.value)) val.District = "District name cannot contain special symbols";            
                  else val.District = "";
                  this.setState({ val });
                }}
                error={(this.state.val.District.length === 0)? false : true}
              />
              <div className={classes.wrapper}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Add Location
                </Button>
                {this.state.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
                onClick={(e) => {
                  console.log("came in");
                  e.preventDefault();
                  if (!this.state.showLocation)
                    this.setState({
                      ...this.state,
                      showLocation: true,
                      showLocationText: "Hide Location",
                    });
                  else
                    this.setState({
                      ...this.state,
                      showLocation: false,
                      showLocationText: "Show Location",
                    });
                  console.log(this.state);
                }}
              >
                {this.state.showLocationText}
              </Button>
            </form>
          </div>
        </Container>
        {this.renderTable()}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Location);
