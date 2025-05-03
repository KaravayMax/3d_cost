
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [productName, setProductName] = useState("");
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [filamentType, setFilamentType] = useState("PLA");
  const [filamentPrice, setFilamentPrice] = useState(750);
  const [weight, setWeight] = useState("");
  const [time, setTime] = useState("");
  const [quality, setQuality] = useState("Среднее (x9)");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("orders");
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const qualityMultiplier = {
    "Низкое (x6)": 6,
    "Среднее (x9)": 9,
    "Высокое (x14)": 14
  };

  const calcCost = () => {
    const energyPrice = 4.32;
    const energyPerHour = 0.35; // кВт
    const filamentPerGram = filamentPrice / 1000;
    const energyCost = (time / 60) * energyPerHour * energyPrice;
    const cost = weight > 0 ? (filamentPerGram + energyCost / weight) * weight : 0;
    return parseFloat(cost.toFixed(2));
  };

  const handleSubmit = () => {
    const cost = calcCost();
    const clientPrice = parseFloat((cost * qualityMultiplier[quality]).toFixed(2));
    const avgMarket = 520;

    const newOrder = {
      date: new Date().toLocaleDateString(),
      name: productName,
      client: clientName,
      phone,
      type: filamentType,
      quality,
      cost,
      clientPrice,
      avgMarket
    };

    setOrders([newOrder, ...orders]);
  };

  const handleDelete = (index) => {
    const updated = orders.filter((_, i) => i !== index);
    setOrders(updated);
  };

  const cost = calcCost();
  const clientPrice = parseFloat((cost * qualityMultiplier[quality]).toFixed(2));

  return (
    <div className="container">
      <h1>Калькулятор вартості</h1>
      <div className="form-section">
        <input placeholder="Назва виробу:" value={productName} onChange={(e) => setProductName(e.target.value)} />
        <input placeholder="ФІО клієнта:" value={clientName} onChange={(e) => setClientName(e.target.value)} />
        <input placeholder="Телефон:" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <select value={filamentType} onChange={(e) => setFilamentType(e.target.value)}>
          <option>PLA</option>
          <option>PLA+</option>
          <option>PETG</option>
          <option>ABS</option>
          <option>TPU</option>
          <option>NEYLON</option>
        </select>
        <input type="number" placeholder="Ціна філамента за 1 кг:" value={filamentPrice} onChange={(e) => setFilamentPrice(e.target.value)} />
        <input type="number" placeholder="Вага моделі (г):" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <input type="number" placeholder="Час друку (хв):" value={time} onChange={(e) => setTime(e.target.value)} />
        <select value={quality} onChange={(e) => setQuality(e.target.value)}>
          <option>Низкое (x6)</option>
          <option>Среднее (x9)</option>
          <option>Высокое (x14)</option>
        </select>
        <button onClick={handleSubmit}>Прийняти замовлення</button>
      </div>

      <div className="result-section">
        <h2>Результат</h2>
        <p><b>Себестоимость:</b> {cost} грн</p>
        <p><b>Ціна для клієнта:</b> <span className="price">{clientPrice} грн</span></p>
        <p><b>Середня ринкова:</b> 520 грн</p>
      </div>

      <h3>Історія замовлень</h3>
      <table>
        <thead>
          <tr>
            <th>Дата</th><th>Назва</th><th>Клієнт</th><th>Телефон</th><th>Тип</th><th>Якість</th><th>Собівартість</th><th>Ціна клієнту</th><th>Середня ринкова</th><th>Дія</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => (
            <tr key={i}>
              <td>{order.date}</td>
              <td>{order.name}</td>
              <td>{order.client}</td>
              <td>{order.phone}</td>
              <td>{order.type}</td>
              <td>{order.quality}</td>
              <td>{order.cost} грн</td>
              <td>{order.clientPrice} грн</td>
              <td>{order.avgMarket} грн</td>
              <td><button onClick={() => handleDelete(i)}>Видалити</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
