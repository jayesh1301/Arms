import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import './LoginStyles.css';
import { useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { login } from './authantication/actionCreator';
import { InputLabel } from '@mui/material';

export default function Login() {
  const history = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => ({
    isAuthenticated: state.auth.login,
  }));

  const handleLogin = async () => {
    dispatch(login({ username, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {      
      history('/table');
    }
  }, [isAuthenticated]);

  return (
    <div className="login-container">
      
      <Paper elevation={5} style={{padding:"15px", border:"1px solid black",backgroundColor:"#ffffff"}}>
      <h1 style={{ textAlign: 'left', fontWeight: 'bold' }}>ARMS 13</h1>

        <Grid container spacing={2} >
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <InputLabel sx={{fontWeight:"bold"}}>Username:</InputLabel>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  placeholder="Username"
                  variant="outlined"
                  size="small"
                  value={username}
                  fullWidth
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <InputLabel sx={{fontWeight:"bold"}}>Password:</InputLabel>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  placeholder="Password"
                  variant="outlined"
                  size="small"
                  type="password"
                  value={password}
                  fullWidth
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="success" size='medium' onClick={handleLogin} style={{ marginLeft: "200px", borderRadius:"20px" }}>
              Login
            </Button> 
            <Button
              variant="contained"
              color="error"
              size='medium'
              onClick={handleLogin}
              style={{ marginLeft: "10px", borderRadius:"20px"  }}
            >
              Cancel
            </Button>
          </Grid>
        
        </Grid>
      </Paper>
    </div>
  );
}
