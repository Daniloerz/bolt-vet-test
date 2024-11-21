import React, { useState } from 'react';
import { Container, Typography, Grid, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Chatbot from './Chatbot.jsx';
import ProductList from './ProductList.jsx';

function App() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [productsDialogOpen, setProductsDialogOpen] = useState(false);
  const [products, setProducts] = useState([]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleSubmit = async () => {
    const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const endDateTime = new Date(appointmentDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 30);

    const appointmentData = {
      startDate: appointmentDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
    };

    const response = await fetch('http://localhost:5678/webhook-test/get_availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    const data = await response.json();
    if (data.available) {
      setAvailabilityMessage('Hay disponibilidad para esta fecha y hora. ¿Desea confirmar la cita?');
      setConfirmDialogOpen(true); // Abrir el diálogo de confirmación
    } else {
      alert('No hay disponibilidad para esta fecha y hora.');
    }

    handleCloseDialog();
  };

  const handleConfirmAppointment = async () => {
    const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const endDateTime = new Date(appointmentDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 30);

    const appointmentData = {
      startDate: appointmentDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
    };

    const response = await fetch('http://localhost:5678/webhook-test/create_appoinment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    const data = await response.json();
    if (data.status === 'Ok') {
      alert(`Cita creada con éxito para ${appointmentDateTime.toLocaleString()}`);
    } else {
      alert('La cita no pudo ser creada, por favor intente de nuevo.');
    }

    setConfirmDialogOpen(false); // Cerrar el diálogo de confirmación
  };

  const handleOpenProductsDialog = async () => {
    const response = await fetch('http://localhost:5678/webhook-test/vet_products');
    const data = await response.json();
    setProducts(data);
    setProductsDialogOpen(true);
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: 20, marginTop: 20, backgroundColor: '#e0f7fa' }}>
        <Typography variant="h4" align="center" color="primary">Tienda Veterinaria</Typography>
        <Typography variant="h5" align="center" color="textSecondary">Bienvenido a nuestra tienda veterinaria</Typography>
      </Paper>
      <Grid container spacing={2} style={{ marginTop: 20 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} style={{ padding: 20, backgroundColor: '#ffffff' }}>
            <Typography variant="h6" color="primary">Consulta Veterinaria</Typography>
            <Typography>Ofrecemos consultas para el bienestar de tus mascotas.</Typography>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>Solicitar Cita</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} style={{ padding: 20, backgroundColor: '#ffffff' }}>
            <Typography variant="h6" color="primary">Productos para Mascotas</Typography>
            <Typography>Encuentra todo lo que necesitas para tus amigos peludos.</Typography>
            <Button variant="contained" color="primary" onClick={handleOpenProductsDialog}>Ver lista de productos</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} style={{ padding: 20, backgroundColor: '#ffffff' }}>
            <Typography variant="h6" color="primary">Urgencias</Typography>
            <Typography>Atención inmediata para emergencias veterinarias.</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Chatbot />

      {/* Dialog for appointment scheduling */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Solicitar Cita</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Seleccione Fecha"
            type="date"
            fullWidth
            variant="outlined"
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Seleccione Hora"
            type="time"
            fullWidth
            variant="outlined"
            onChange={handleTimeChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancelar</Button>
          <Button onClick={handleSubmit} color="primary">Enviar</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation dialog for appointment */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirmar Cita</DialogTitle>
        <DialogContent>
          <Typography>{availabilityMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">Cancelar</Button>
          <Button onClick={handleConfirmAppointment} color="primary">Confirmar cita</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for product list */}
      <Dialog open={productsDialogOpen} onClose={() => setProductsDialogOpen(false)}>
        <DialogTitle>Lista de Productos</DialogTitle>
        <DialogContent>
          <ProductList products={products} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductsDialogOpen(false)} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;