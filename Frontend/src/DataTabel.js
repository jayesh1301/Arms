import React, { useState, useEffect } from 'react';
import {
  Paper,
  CircularProgress,
  IconButton,
  Toolbar,
  Button
} from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { ADD_BASE_PATH } from './lib/api-base-path';
import dayjs from 'dayjs'; 
import { useNavigate } from 'react-router-dom'; 
import { useDispatch,useSelector } from "react-redux";
import LogoutIcon from '@mui/icons-material/Logout'
import { logOut } from './authantication/actionCreator';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const StoreReport = () => {
  const dispatch = useDispatch()
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${ADD_BASE_PATH}/getAllData`);
        const jsonData = await response.json();
  
        // Ensure unique IDs for each row using uuid
        // const rowsWithUniqueIds = jsonData.map((row, index) => ({
        //   ...row,
        //   srNo: index + 1, // Start from 1 and increment
        // }));
  
        // Filter out rows where transection_id is null
       // Filter out rows where transection_id is null
       const filteredRows = jsonData.filter(row => row.transection_id != "");
  

  
        // Format dates to dd-mm-yyyy
        const formattedRows = filteredRows.map(row => ({
          ...row,
          date_of_birth: dayjs(row.date_of_birth, { format: 'YYYY-MM-DD' }).format('DD-MM-YYYY'),
          date_of_issue: dayjs(row.date_of_issue, { format: 'YYYY-MM-DD' }).format('DD-MM-YYYY'),
          date_of_expiry: dayjs(row.date_of_expiry, { format: 'YYYY-MM-DD' }).format('DD-MM-YYYY'),
          date_of_arrival: dayjs(row.date_of_arrival, { format: 'YYYY-MM-DD' }).format('DD-MM-YYYY'),
          date_of_departure: dayjs(row.date_of_departure, { format: 'YYYY-MM-DD' }).format('DD-MM-YYYY'),
        }));
  
        console.log(filteredRows);
        const reversedRows = formattedRows.reverse();
        const rowsWithUniqueIds = reversedRows.map((row, index) => ({
          ...row,
          srNo: index + 1, // Start from 1 and increment
        }));
        setRows(rowsWithUniqueIds);
        //setRows(formattedRows);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  

 
  const { isAuthenticated } = useSelector((state) => {
    return {      
      isAuthenticated: state.auth.login,
    };
  });
 

  const handleDelete = () => {       
    dispatch(logOut());     
  };
  useEffect(() => {
    if(!isAuthenticated){      
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const getRowId = (row) => row.srNo;

  const getRowClassName = (params) => {
    // Apply the background color #f2f2f2 to all rows
    return 'custom-row-class';
  };
  const columns = [
    { field: 'srNo',headerName: 'SR No',headerClassName: 'custom-header-class', },
    { field: 'country', headerName: 'Country',  headerClassName: 'custom-header-class' },
    { field: 'events',headerName: 'Events', headerClassName: 'custom-header-class' },
    { field: 'source', headerName: 'Short Course',  headerClassName: 'custom-header-class' },
    { field: 'workshop', headerName: 'Workshop',  headerClassName: 'custom-header-class' },
    { field: 'name', headerName: 'Name',  headerClassName: 'custom-header-class' },
    { field: 'email', headerName: 'Email', headerClassName: 'custom-header-class' },
    { field: 'organization', headerName: 'Organization', headerClassName: 'custom-header-class' },
    { field: 'designation', headerName: 'Designation', headerClassName: 'custom-header-class' },
    { field: 'address', headerName: 'Address', headerClassName: 'custom-header-class' },
    { field: 'postal_code', headerName: 'Postal Code', headerClassName: 'custom-header-class' },
    { field: 'date_of_birth', headerName: 'Date of Birth', headerClassName: 'custom-header-class' },
    { field: 'passport_no', headerName: 'Passport no.', headerClassName: 'custom-header-class' },
    { field: 'date_of_issue', headerName: 'Date of Issue', headerClassName: 'custom-header-class' },
    { field: 'date_of_expiry', headerName: 'Date of Expiry', headerClassName: 'custom-header-class' },
    { field: 'place_of_issue', headerName: 'Place of Issue', headerClassName: 'custom-header-class' },
    { field: 'date_of_arrival', headerName: 'Date of Arrival', headerClassName: 'custom-header-class' },
    { field: 'date_of_departure', headerName: 'Date of Departure', headerClassName: 'custom-header-class' },
    { field: 'transection_id', headerName: 'Transection ID', headerClassName: 'custom-header-class' },
    { field: 'payment_type', headerName: 'Payment Type', headerClassName: 'custom-header-class' },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName: 'custom-header-class',
      renderCell: (params) => {
        const statusValue = params.value;
  
        // Customize the rendering based on the status value
        if (statusValue == 0) {
          // Display "Fail" for status 0 or null
          return <span style={{ color: 'red' }}>Fail</span>;
        } else if (statusValue == 1) {
          // Display "Success" for status 1
          return <span style={{ color: 'green' }}>Success</span>;
        } else {
          // Handle other cases if needed
          return <span>{statusValue}</span>;
        }
      },
    },
    
    {
      field: 'amount',
      headerName: 'Amount',
      headerClassName: 'custom-header-class',
      renderCell: (params) => {
        const paymentType = params.row.payment_type ? params.row.payment_type.toLowerCase() : '';
        const currencySymbol = (paymentType === 'razor' || paymentType === 'razorpay') 
          ? '₹' // Display in Rupees for Razor and RazorPay
          : '$'; // Display in Dollars for other payment types
    
        const amount = params.value != null ? params.value : 'N/A'; // Handle null or undefined values
    
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {currencySymbol}
            {amount}
          </div>
        );

      },
    },
    { field: 'accompanyname', headerName: 'Accompanying Name', headerClassName: 'custom-header-class' },
    { field: 'accompanydob', headerName: 'Accompanying Date of Birth', headerClassName: 'custom-header-class' },
    { field: 'accompanyrelationship', headerName: 'Accompanying Relationship', headerClassName: 'custom-header-class' },
    { field: 'accompanypassportno', headerName: 'Accompanying Passportno', headerClassName: 'custom-header-class' },
    { field: 'accompanydateodissue', headerName: 'Accompanying Date of Issue', headerClassName: 'custom-header-class' },
    { field: 'accompanydateodexpiry', headerName: 'Accompanying Date of Expiry', headerClassName: 'custom-header-class' },
    { field: 'accompanyplaceofissue', headerName: 'Accompanying Place of Issue', headerClassName: 'custom-header-class' }
    
    ];
  

 
  return (
    <>
    <div className="d-flex justify-content-between" style={{ position: "relative", bottom: 13 }}>
   
    </div>
    <Paper elevation={6} style={{ position: "relative", bottom: 49, overflow: "auto", marginTop: "40px", padding: '14px' }}>
    <Button onClick={handleDelete} startIcon={<LogoutIcon/>} variant="contained"  color="primary" style={{ marginTop:'5px', marginLeft:'91%'}} >
          {/* <LogoutIcon style={{ marginRight: '8px' }} /> */}
          Logout
        </Button>
       
        <div>
          {rows.length === 0 ? (
            // Render a message when there is no data
            <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '20px', fontWeight: 'bold' }}>
              Data No Found
            </div>
          ) : (
            // Render DataGrid when there is data
            <div style={{ height: "100%", width: '100%' }}>
              <DataGrid
                rows={rows}
                density='compact'
                columns={columns}
                loading={isLoading}
                pagination
                pageSize={rowsPerPage}
                page={page}
                rowsPerPageOptions={[5, 10]}
                rowCount={rows.length}
                getRowId={(row) => row.srNo}
                getRowClassName={getRowClassName}
                components={{
                  Toolbar: () => (
                    <Toolbar>
                      <GridToolbarContainer>
                        <GridToolbarExport />
                      </GridToolbarContainer>
                    </Toolbar>
                  ),
                }}
              />
            </div>
          )}
        </div>
      </Paper>
  </>
  );
};

export default StoreReport;
