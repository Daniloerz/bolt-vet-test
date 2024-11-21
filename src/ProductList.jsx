import React from 'react';
    import { Typography, Box } from '@mui/material';

    const ProductList = ({ products }) => {
      return (
        <Box>
          {products.map((product) => (
            <Box key={product._id} style={{ marginBottom: 20, border: '1px solid #ccc', borderRadius: 8, padding: 10 }}>
              <Typography variant="h6">{product.nombre}</Typography>
              <Typography variant="body2">{product.descripcion}</Typography>
              <Typography variant="body2">Precio: ${product.precio.toFixed(2)}</Typography>
              <img src={`http://localhost:5678/images/${product._id}.jpg`} alt={product.nombre} style={{ width: '100%', height: 'auto', borderRadius: 8 }} />
            </Box>
          ))}
        </Box>
      );
    };

    export default ProductList;
