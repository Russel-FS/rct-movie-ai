import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';

type Producto = { name: string; description: string; price: string; type: string; image: any };

export default function CineEstelarMenu() {
  const { width, height } = Dimensions.get('window');
  const tGrande = width * 0.07;
  const tMedio = width * 0.045;
  const tPeque = width * 0.035;

  const productos: Record<string, Producto[]> = {
    Combos: [
      {
        name: "Combo Trio Estelar",
        description: "3 Canchitas medianas + 3 Bebidas grandes",
        price: "S/ 85.90",
        type: "COMBO",
        image: require('../../../assets/combotrio.png')
      },
      {
        name: "Combo Duo Estelar",
        description: "2 Canchitas + 2 Bebidas grandes",
        price: "S/ 47.30",
        type: "COMBO",
        image: { uri: "https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca61/common/529-1754336185869" }
      },
      {
        name: "Combinación 1 Estelar",
        description: "1 Canchita + 1 Bebida",
        price: "S/ 22.20",
        type: "COMBO",
        image: { uri: "https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca64/common/530-1754336201782" }
      },
      {
        name: "Mega Combinación Estelar",
        description: "1 Canchita + 1 Bebida grande",
        price: "S/ 22.90",
        type: "COMBO",
        image: { uri: "https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca67/common/531-1754336216332" }
      },
    ],
    Canchita: [
      {
        name: "Canchita Mediana",
        description: "Clásica con mantequilla",
        price: "S/ 15.00",
        type: "CANCHITA",
        image: { uri: "https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca76/common/535-1754336275727" }
      },
      {
        name: "Canchita Grande",
        description: "Ideal para compartir",
        price: "S/ 20.00",
        type: "CANCHITA",
        image: { uri: "https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca79/common/1094-1754336288561" }
      },
    ],
    Bebidas: [
      {
        name: "Gaseosa Grande",
        description: "Tamaño grande, refrescante",
        price: "S/ 12.00",
        type: "BEBIDA",
        image: { uri: "https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca7f/common/1095-1752610498463" }
      },
      {
        name: "Gaseosa Mediana",
        description: "Tamaño mediano",
        price: "S/ 9.00",
        type: "BEBIDA",
        image: { uri: "https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca7c/common/537-1752610612431" }
      },
      {
        name: "Agua sin Gas",
        description: "Botella de agua sin gas",
        price: "S/ 7.00",
        type: "BEBIDA",
        image: { uri: "https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca82/common/538-1752610632804" }
      },
    ],
    Snacks: [
      {
        name: "Hot Dog Frankfurter",
        description: "Pan, salchicha, mostaza y ketchup",
        price: "S/ 16.00",
        type: "SNACK",
        image: { uri: "https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca88/common/534-1756913017116" }
      },
      {
        name: "Nachos con Queso",
        description: "Nachos crujientes con queso cheddar",
        price: "S/ 18.00",
        type: "SNACK",
        image: { uri: "https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca91/common/536-1756912982119" }
      },
    ],
    Dulces: [
      {
        name: "M&M's",
        description: "Bolsa 150g",
        price: "S/ 12.00",
        type: "DULCE",
        image: { uri: "https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/67925fc2890878ee2b0e6386/common/1100-1752618390328" }
      }
    ],
    Coleccionables: [
      {
        name: "Combo Duo Superman",
        description: "Combo edición especial Superman",
        price: "S/ 49.90",
        type: "COLECCIONABLE",
        image: { uri: "https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/687ff623be197a99a4397654/common/15325-1754592931469" }
      },
      {
        name: "Combo Vaso 4 Fantástico",
        description: "Incluye vaso edición especial",
        price: "S/ 39.90",
        type: "COLECCIONABLE",
        image: { uri: "https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/6883c5aeebe651c5cb3c42cb/common/15374-1754592910175" }
      },
      {
        name: "Combo Duo Cabeza Pitufo",
        description: "Combo edición Pitufo",
        price: "S/ 44.90",
        type: "COLECCIONABLE",
        image: { uri: "https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/687ff623be197a99a4397660/common/15327-1754592965166" }
      }
    ],
    Convenios: [
      {
        name: "Combo Gigante Ripley",
        description: "Canchita gigante + 2 bebidas grandes",
        price: "S/ 69.90",
        type: "CONVENIO",
        image: { uri: "https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/67d3050ca977aed84282bec1/common/15159-1754346176877" }
      }
    ]
  };

  const categorias = Object.keys(productos);
  const [catActiva, setCatActiva] = useState("Combos");
  const [carrito, setCarrito] = useState<Producto[]>([]);

  const agregarCarrito = (producto: Producto) => {
    setCarrito([...carrito, producto]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1f2937' }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 8 }}
      >
        <Image
          source={require('../../../assets/cineestelar.png')}
          style={{ width, height: height * 0.18 }}
          resizeMode="cover"
        />
        <Image
          source={require('../../../assets/bannercine.png')}
          style={{ width, height: height * 0.18 }}
          resizeMode="cover"
        />
      </ScrollView>

      {/* Categorías */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: '#374151', backgroundColor: '#111827', marginTop: 12 }}
      >
        {categorias.map(c => (
          <TouchableOpacity
            key={c}
            onPress={() => setCatActiva(c)}
            style={{ marginHorizontal: 14 }}
          >
            <Text
              style={{
                fontSize: tMedio,
                fontWeight: catActiva === c ? '700' : '500',
                color: catActiva === c ? '#fbbf24' : '#9ca3af'
              }}
            >
              {c.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista productos */}
      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 140 }}>
        {productos[catActiva].map(p => (
          <View
            key={p.name}
            style={{
              backgroundColor: '#374151',
              borderRadius: 12,
              marginBottom: 18,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 4
            }}
          >
            <Image
              source={p.image}
              style={{
                width: '100%',
                height: height * 0.25,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12
              }}
              resizeMode="cover"
            />
            <View style={{ padding: 12 }}>
              <Text style={{ fontSize: tMedio, fontWeight: '700', marginBottom: 4, color: '#fff' }}>
                {p.name}
              </Text>
              <Text style={{ fontSize: tPeque, color: '#d1d5db', marginBottom: 6 }}>
                {p.description}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: tMedio, fontWeight: '700', color: '#fbbf24' }}>
                  {p.price}
                </Text>
                <TouchableOpacity
                  onPress={() => agregarCarrito(p)}
                  style={{
                    backgroundColor: '#2563eb',
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: 30
                  }}
                >
                  <Text style={{ color: 'white', fontSize: tMedio }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Botón continuar */}
      {carrito.length > 0 && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            backgroundColor: '#16a34a',
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: 'white', fontSize: tMedio, fontWeight: '700' }}>
            Continuar ({carrito.length} productos)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
