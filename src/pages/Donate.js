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
function createData(id, tid, date, accNo, contact, amount) {
  return { id, tid, date, accNo, contact, amount };
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
      createData(0, "T00001", "2020-01-22", "123456789101112", "9999999999", 60000000),
      createData(1, "T00002", "2020-04-11", "123456769009224", "9676313275", 1000),
      createData(2, "T00003", "2020-01-02", "123565678432156", "8985546789", 1000),
      createData(3, "T00004", "2020-05-07", "567895432167889", "9678654329", 1000),
      createData(4, "T00005", "2020-07-03", "123564567897656", "7702184949", 1000),
      createData(5, "T00006", "2020-01-10", "678954325689567", "9490384823", 1000),
      createData(6, "T00007", "2020-06-06", "789456345678956", "9989654329", 1000),
      createData(7, "T00008", "2020-05-15", "657894325678976", "9989442189", 1000),
      createData(8, "T00009", "2020-02-21", "456789543267798", "6302856789", 1000),
      createData(9, "T00010", "2020-03-20", "345678934523678", "7302184965", 1000)
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
