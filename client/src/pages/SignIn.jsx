import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, redirect, useNavigate } from "react-router-dom";
import { MainContext } from "../Context/mainContext";
import axios from "axios";
import Loader from "../components/Loader";
import toast, { Toaster } from "react-hot-toast";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="">
        Decent Developers
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Login() {
  const { user, setUser, isLoggedIn, setIsLoggedIn, prevUrl } =
    React.useContext(MainContext);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  };
  React.useEffect(() => {
    setLoading(true);
    axios.get("/").then((res) => {
      if (res.data.user && res.data.statusCode === 400) {
        setLoading(true);
        setUser(res.data.user.user);
        setIsLoggedIn(true);
      } else {
        navigate("/signin");
        setLoading(false);
      }
    });
  }, []);
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    await axios.post("/login", formData, { headers }).then((res) => {
      if (res.data.statusCode === 200) {
        setUser(res.data.user);
        setIsLoggedIn(true);
        setLoading(false);
        if (res.data.user.status === "Blocked") {
          navigate("/accounts/me");
        }
        navigate(prevUrl ? prevUrl + "?msg=Welcome" : "/pos");
      } else {
        navigate("/signin?msg=Failed to login");
        toast.error(res.data.message, { duration: 6000, icon: "🤦‍♂️" });
        setLoading(false);
      }
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Toaster position="bottom-right" reverseOrder={true} />

      {loading != true ? (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="Username"
                label="Username"
                name="Username"
                autoComplete="username"
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                }}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                }}
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/accounts/new/role" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      ) : (
        <Loader />
      )}
    </ThemeProvider>
  );
}
