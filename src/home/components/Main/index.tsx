// CÓMO DEBERÍA QUEDAR:  src/home/components/Main/index.tsx

import React from 'react';
import { View, Text } from 'react-native';
// Ya no necesitas importar el Header aquí, así que puedes borrar la línea de import también.

const Main = () => {
  return (
    <View>
      {/* El Header ya no está. App.tsx se encarga de él. */}
      
      {/* Aquí va el resto de tu contenido */}
      <Text>Este es el contenido principal</Text>
    </View>
  );
};
//centra todo el text 
export default Main;