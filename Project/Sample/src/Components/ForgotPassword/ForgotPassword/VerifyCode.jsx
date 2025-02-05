import React, {useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const VerifyCode = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state;

    const handleCodeChange = (e) => {
        setCode(e.target.value);
    };


    const handleVerifyCode = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_URL}/verifycode`, { email, code });
            if (response.error) {
                setError(response.msg);
            } else {
                navigate('/resetpassword', { state: { email } });
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Verify Code</h2>
            {error && <p style={styles.errorMsg}>{error}</p>}
            <TextField
    label="Enter 4-digit code"
    value={code}
    onChange={handleCodeChange}
    variant="outlined"
    fullWidth
    // style={{ width: '100%', fontSize: '20px', height: '60px' }} // Adjust the width, font size, and height as needed
    InputProps={{
        style: {
            height: '60px', // Adjust height
            fontSize: '20px', // Increase the font size
            padding: '0px', // Adjust padding
        }
    }}
/>

            <div style={styles.buttonContainer}>
                <Button
                    onClick={handleVerifyCode}
                    variant="contained"
                    color="primary"
                    style={styles.verifyButton}
                >
                    Verify Code
                </Button>
                <Button
                    onClick={() => navigate('/')}
                    variant="outlined"
                    color="secondary"
                    style={styles.cancelButton}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        borderRadius: '12px',
        maxWidth: '400px',
        margin: 'auto',
    },
    heading: {
        marginBottom: '20px',
        color: '#333',
        fontWeight: '600',
        textAlign: 'center',
    },
    errorMsg: {
        color: 'red',
        marginBottom: '10px',
        fontSize: '14px',
    },
    textField: {
        marginBottom: '20px',
        minHeight: '20px',
        borderRadius: '8px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
    },
    verifyButton: {
        flex: 1,
        marginRight: '10px',
        backgroundColor: '#007BFF',
        color: '#fff',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '16px',
        textTransform: 'none',
    },
    cancelButton: {
        flex: 1,
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '16px',
        textTransform: 'none',
        color: '#333',
        borderColor: '#333',
    },
};

export default VerifyCode;
