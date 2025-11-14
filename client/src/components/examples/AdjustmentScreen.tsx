import AdjustmentScreen from '../AdjustmentScreen'

export default function AdjustmentScreenExample() {
  sessionStorage.setItem("requesterName", "John");
  sessionStorage.setItem("selectedType", "instrument");
  sessionStorage.setItem("selectedName", "Drums");
  return <AdjustmentScreen />
}
