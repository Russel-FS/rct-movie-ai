import { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { MapPin, Clock, Armchair, UtensilsCrossed, CreditCard, Receipt, Film } from 'lucide-react-native';

// Importar las páginas de navegación
import SeleccionLugar from './SeleccionLugar';
import SeleccionHorario from './SeleccionHorario';
import SeleccionButacas from './SeleccionButacas';
import SeleccionComidas from './SeleccionComidas';
import MetodoPago from './MetodoPago';
import ResumenPago from './ResumenPago';

type NavStep = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

export default function Cartelera() {
  const [activeStep, setActiveStep] = useState<string>('lugar');

  const navSteps: NavStep[] = [
    { id: 'lugar', label: 'Selección de lugar', icon: <MapPin size={16} color="white" /> },
    { id: 'horario', label: 'Selección horario', icon: <Clock size={16} color="white" /> },
    { id: 'butacas', label: 'Selección de butacas', icon: <Armchair size={16} color="white" /> },
    { id: 'comidas', label: 'Selección de comidas', icon: <UtensilsCrossed size={16} color="white" /> },
    { id: 'pago', label: 'Método pago', icon: <CreditCard size={16} color="white" /> },
    { id: 'resumen', label: 'Resumen', icon: <Receipt size={16} color="white" /> },
  ];

  const handleStepPress = (stepId: string) => {
    setActiveStep(stepId);
  };

  const renderContent = () => {
    switch (activeStep) {
      case 'lugar':
        return <SeleccionLugar />;
      case 'horario':
        return <SeleccionHorario />;
      case 'butacas':
        return <SeleccionButacas />;
      case 'comidas':
        return <SeleccionComidas />;
      case 'pago':
        return <MetodoPago />;
      case 'resumen':
        return <ResumenPago />;
      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1">
      <View className="px-4 py-6">
        <View className="mb-6 flex-row items-center">
          <Film size={24} color="white" />
          <Text className="ml-2 text-2xl font-bold text-white">Cartelera</Text>
        </View>

        {/* Encabezado de navegación */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="mb-6">
          <View className="flex-row space-x-2">
            {navSteps.map((step) => (
              <TouchableOpacity
                key={step.id}
                className={`px-3 py-2 rounded-full flex-row items-center ${activeStep === step.id ? 'bg-blue-600' : 'bg-gray-700'}`}
                onPress={() => handleStepPress(step.id)}
                activeOpacity={0.7}>
                {step.icon}
                <Text className="text-white text-xs ml-1">{step.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Contenido según el paso seleccionado */}
        {renderContent()}
      </View>
    </ScrollView>
  );
}
