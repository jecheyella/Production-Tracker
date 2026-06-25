import { db } from "./firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export function listenToEquipment(callback) {
const equipmentRef = ref(db, "equipment");

onValue(equipmentRef, (snapshot) => {
    callback(snapshot.val());
});
}