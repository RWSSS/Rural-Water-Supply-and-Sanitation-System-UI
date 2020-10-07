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
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";

// Generate Order Data
function createData(id, tid, date, name, accNo, contact, amount) {
  return { id, tid, date, name, accNo, contact, amount };
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

class Donate extends React.Component {
  state = {
    rows: [
      createData(0, "TX1", "08-09-2020", "Elvis Presley", "00000020312420312", "9876543210", 1000),
      createData(1, "TX2", "07-09-2020", "Paul McCartney", "00000024185629743", "9876543211", 200),
      createData(2, "TX3", "09-09-2020", "Tom Scholz", "00000028473628512", "9876543212", 500),
      createData(3, "TX4", "10-09-2020", "Michael Jackson", "00000025649286576", "9876543213", 2000),
      createData(
        4,
        "TX5",
        "05-09-2020",
        "Bruce Springsteen",
        "00000025431826987",
        "9876543214",
        750
      ),
    ],
    showDonors: false,
    showDonorsText: "Show Donors",
    phoneErrorText: "",
    phone: false,
    open: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if(this.state.phone)
      return;
    var d = new Date();
    var date =
      +("0" + d.getDate()).slice(-2) +
      "-" +
      ("0" + (d.getMonth() + 1)).slice(-2) +
      "-" +
      d.getFullYear();
    var newrows = this.state.rows;
    newrows.push(
      createData(
        this.state.rows.length,
        e.target.tid.value,
        date,
        e.target.name.value,
        e.target.accNo.value,
        e.target.contact.value,
        e.target.amount.value
      )
    );
    this.setState({ ...this.state, rows: newrows, open: true });
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
    if (this.state.showDonors) {
      return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h2" variant="h6" gutterBottom>
                  All Donations
                </Typography>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Account Number</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.tid}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.accNo}</TableCell>
                        <TableCell>{row.contact}</TableCell>
                        <TableCell align="right">{row.amount}</TableCell>
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
            message={<span id="client-snackbar">Donation Successful!</span>}
          />
        </Snackbar>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Donate
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="tid"
                label="Transaction ID"
                name="tid"
                type="text"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="name"
                label="Name"
                type="text"
                id="name"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="accNo"
                label="Account Number"
                type="text"
                id="accNo"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="contact"
                label="Contact"
                type="number"
                id="contact"
                inputProps={{ maxLength: 10, minLength: 10 }}
                helperText={this.state.phoneErrorText}
                validateOnBlur
                onChange={(e) => {
                  if (e.target.value.length !== 10)
                    this.setState({ ...this.state, phone: true, phoneErrorText: "Phone Number must be of 10 digits." });
                  else this.setState({ ...this.state, phone: false, phoneErrorText: "" });
                }}
                error={this.state.phone}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="amount"
                label="Amount"
                type="number"
                id="amount"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Donate Now!
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
                onClick={(e) => {
                  console.log("came in");
                  e.preventDefault();
                  if (!this.state.showDonors)
                    this.setState({
                      ...this.state,
                      showDonors: true,
                      showDonorsText: "Hide Donors",
                    });
                  else
                    this.setState({
                      ...this.state,
                      showDonors: false,
                      showDonorsText: "Show Donors",
                    });
                  console.log(this.state);
                }}
              >
                {this.state.showDonorsText}
              </Button>
            </form>
          </div>
        </Container>
        {this.renderTable()}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Donate);
