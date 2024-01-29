const colors = [
  '#DC143C',
  '#FF4500',
  '#FFA500',
  '#6B8E23',
  '#006400',
  '#32CD32',
  '#20B2AA',
  '#00CED1',
  '#6495ED',
  '#4169E1',
  '#8B008B',
  '#FF00FF',
  '#DB7093',
  '#A0522D',
  '#87CEFA',
  '#BA55D3',
];


const getColor = () => {return colors[Math.floor(Math.random() * (colors.length - 0 + 1)) + 0];};

export default getColor;