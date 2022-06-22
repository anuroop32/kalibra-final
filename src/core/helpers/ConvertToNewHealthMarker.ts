import { HealthMarker, NewHealthMarker } from '../types/HealthMarkerReport';

export const convertToNewHealthMarker = (oldHealMarker: HealthMarker): NewHealthMarker => {
  const newHM: NewHealthMarker = {
    id: 0,
    key: '',
    name: '',
    displayValue: '',
    unit: '',
    minValue: 0,
    maxValue: 0,
    rn: '',
    categories: [],
    displayCategoryColor: '',
    reportType: '',
    graphType: '',
    info: '',
    recommendation: '',
    pillar: ''
  };

  newHM.id = oldHealMarker.id;
  newHM.key = oldHealMarker.key;
  newHM.name = oldHealMarker.type;
  newHM.displayValue = oldHealMarker.displayValue;
  newHM.minValue = oldHealMarker.minValue;
  newHM.maxValue = oldHealMarker.maxValue;
  newHM.reportType = oldHealMarker.reportType;
  newHM.graphType = oldHealMarker.graphType;
  newHM.info = oldHealMarker.info;
  newHM.unit = oldHealMarker.unit;
  newHM.pillar = oldHealMarker.pillar;
  newHM.recommendation = oldHealMarker.recommendation;
  oldHealMarker.categories.forEach((item) => {
    newHM.categories.push({
      healthMarkerId: 0,
      rangeLabelAlt: '',
      rangeLabel: oldHealMarker.graphCategory[0][item.label],
      minimum: String(item.minValue),
      maximum: String(item.maxValue),
      displayOrder: 1,
      color: item.color
    });
  });
  return newHM;
};
