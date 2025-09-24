import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

type Producto = { name: string; description: string; price: string; type: string; };

export default function SeleccionComidas() {
  const { width, height } = Dimensions.get('window');
  // Define responsive font sizes and padding
  const tGrande = width * 0.07; // Main title
  const tMedio = width * 0.05;  // Item names and prices, subtitles
  const tPeque = width * 0.038; // Item descriptions, category text
  const paddingGeneral = width * 0.04; // General padding for the screen and cards

  const productos: Record<string, Producto[]> = {
    Combos: [
      { name: "Combo Clásico", description: "Palomitas medianas + Refresco mediano", price: "$8.50", type: "COMBO" },
      { name: "Combo Familiar", description: "Palomitas grandes + 2 Refrescos medianos", price: "$12.00", type: "COMBO" },
      { name: "Combo Premium", description: "Palomitas grandes + Refresco grande + Nachos", price: "$15.50", type: "COMBO" },
    ],
    Palomitas: [
      { name: "Palomitas Medianas", description: "Crujientes palomitas con mantequilla", price: "$4.00", type: "PALOMITAS" },
      { name: "Palomitas Grandes", description: "El doble de sabor, ideal para compartir", price: "$6.50", type: "PALOMITAS" },
      { name: "Palomitas Extra Grande", description: "Para los verdaderos amantes del cine", price: "$8.00", type: "PALOMITAS" },
    ],
    Bebidas: [
      { name: "Refresco Mediano", description: "Coca Cola, Fanta, Sprite, Pepsi", price: "$2.50", type: "BEBIDA" },
      { name: "Refresco Grande", description: "El tamaño perfecto para tu sed", price: "$3.50", type: "BEBIDA" },
      { name: "Agua Mineral", description: "Botella de 500ml", price: "$2.00", type: "BEBIDA" },
      { name: "Jugo Natural", description: "Naranja, Manzana o Piña", price: "$3.00", type: "BEBIDA" },
    ],
    Dulces: [
      { name: "Chocolates Variados", description: "Snickers, M&M's, Kit Kat", price: "$1.50", type: "DULCE" },
      { name: "Gomitas Surtidas", description: "Ositos, aros y más", price: "$1.00", type: "DULCE" },
      { name: "Barra de Caramelo", description: "Sabores surtidos", price: "$1.20", type: "DULCE" },
      { name: "Helado Pequeño", description: "Vainilla, Chocolate o Fresa", price: "$3.00", type: "DULCE" },
    ],
  };

  const categorias = Object.keys(productos);
  const [catActiva, setCatActiva] = useState("Combos");

  return (
    <View style={{ flex: 1, backgroundColor: '#1f2937', paddingTop: height * 0.06, paddingHorizontal: paddingGeneral }}>
      {/* Back Button and Title */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: height * 0.02 }}>
        <TouchableOpacity style={{ padding: width * 0.01 }}>
          {/* You might want to replace this with an actual icon component like from 'react-native-vector-icons' */}
          <Text style={{ fontSize: tGrande * 0.8, color: 'white' }}>&#x2190;</Text> 
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', marginRight: width * 0.08 }}> {/* Adjust margin to center title properly */}
          <Text style={{ fontSize: tGrande, fontWeight: '700', color: 'white' }}>Seleccionar Comida</Text>
          <Text style={{ fontSize: tPeque, color: '#9ca3af', marginTop: height * 0.005 }}>Agrega algo delicioso</Text>
        </View>
      </View>

      {/* Horizontal Category Scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: height * 0.02 }}>
        {categorias.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setCatActiva(c)}
            style={{
              paddingHorizontal: width * 0.06,
              paddingVertical: height * 0.012,
              borderRadius: 50,
              backgroundColor: catActiva === c ? '#2563eb' : '#374151',
              marginRight: width * 0.02 // Adjusted for better spacing
            }}
          >
            <Text style={{ fontSize: tPeque, fontWeight: '500', color: catActiva === c ? 'white' : '#d1d5db' }}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product List */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: height * 0.03, rowGap: height * 0.015 }}>
        {productos[catActiva].map(p => (
          <View key={p.name} style={{
            backgroundColor: '#374151',
            borderRadius: 12,
            padding: paddingGeneral,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <View style={{ flex: 1, marginRight: width * 0.03 }}>
              {/* Type tag (e.g., COMBO, PALOMITAS) */}
              <View style={{
                paddingHorizontal: width * 0.03,
                paddingVertical: height * 0.008,
                borderRadius: 6,
                marginBottom: height * 0.008,
                // Dynamic background color based on type for visual distinction
                backgroundColor: p.type === "COMBO" ? '#10b981' : // Green for Combos
                                 p.type === "PALOMITAS" ? '#fbbf24' : // Yellow for Popcorn
                                 p.type === "BEBIDA" ? '#3b82f6' : // Blue for Drinks
                                 p.type === "DULCE" ? '#ec4899' : // Pink for Sweets
                                 '#6b7280' // Default grey
              }}>
                <Text style={{ fontSize: tPeque * 0.9, fontWeight: '700', color: '#e5e7eb' }}>{p.type}</Text>
              </View>
              <Text style={{ fontSize: tMedio, fontWeight: '600', color: 'white' }}>{p.name}</Text>
              <Text style={{ fontSize: tPeque, color: '#d1d5db', marginTop: height * 0.003 }}>{p.description}</Text>
              <Text style={{ fontSize: tMedio, fontWeight: '700', color: 'white', marginTop: height * 0.008 }}>{p.price}</Text>
            </View>
            <TouchableOpacity style={{ backgroundColor: '#2563eb', paddingHorizontal: width * 0.05, paddingVertical: height * 0.015, borderRadius: 50 }}>
              <Text style={{ fontSize: tMedio, fontWeight: '700', color: 'white' }}>+</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: height * 0.03, paddingBottom: height * 0.03 }}>
        <TouchableOpacity style={{ backgroundColor: '#4b5563', paddingVertical: height * 0.02, borderRadius: 12, flex: 1, marginRight: width * 0.02, alignItems: 'center' }}>
          <Text style={{ fontSize: tMedio, fontWeight: '600', color: 'white' }}>Omitir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: '#2563eb', paddingVertical: height * 0.02, borderRadius: 12, flex: 1, marginLeft: width * 0.02, alignItems: 'center' }}>
          <Text style={{ fontSize: tMedio, fontWeight: '600', color: 'white' }}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}