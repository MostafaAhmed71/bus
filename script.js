document.addEventListener('DOMContentLoaded', () => {
    const seatGrid = document.getElementById('seatGrid');
    const passengerItems = document.getElementById('passengerItems');
    const passengerModal = new bootstrap.Modal(document.getElementById('passengerModal'));
    const editPassengerModal = new bootstrap.Modal(document.getElementById('editPassengerModal'));
    let passengers = [];

    const totalSeats = 49; // العدد الإجمالي للمقاعد
    let seatNumber = 1;

    // ترتيب المقاعد
    for (let row = 0; row < 13; row++) {
        for (let col = 0; col < 5; col++) {
            const seat = document.createElement('div');
            seat.classList.add('seat');

            if (col === 2) {
                if (row === 12) { // المقعد المتصل في النهاية
                    seat.textContent = totalSeats;
                    seat.classList.add('connecting-seat');
                    seat.classList.remove('seat');
                } else {
                    seat.classList.add('aisle');
                    seat.textContent = '';
                }
            } else if ((row === 3 && (col === 0 || col === 1)) || (row === 4 && (col === 0 || col === 1))) {
                seat.classList.add('entrance');
                seat.textContent = 'مدخل';
            } else if (seatNumber <= totalSeats - 1) {
                seat.textContent = seatNumber++;
                seat.classList.add('available');
            } else {
                seat.classList.add('unavailable');
                seat.textContent = '';
            }

            seat.addEventListener('click', () => {
                if (seat.classList.contains('available') || seat.classList.contains('connecting-seat')) {
                    document.getElementById('seatNumber').value = seat.textContent;
                    passengerModal.show();
                } else if (seat.classList.contains('booked')) {
                    const passenger = passengers.find(p => p.seat === seat.dataset.seat);
                    if (passenger) {
                        alert(`اسم الراكب: ${passenger.name} | من: ${passenger.from} | إلى: ${passenger.to}`);
                    }
                } else if (seat.classList.contains('aisle')) {
                    alert('هذا المكان هو ممر، غير متاح للحجز');
                } else if (seat.classList.contains('entrance')) {
                    alert('هذا المكان هو مدخل الباص، غير متاح للحجز');
                }
            });

            seatGrid.appendChild(seat);
        }
    }

    // حفظ اسم الراكب مع المدن وعرضه على المقعد
    document.getElementById('savePassenger').addEventListener('click', () => {
        const name = document.getElementById('passengerName').value;
        const from = document.getElementById('passengerFrom').value;
        const to = document.getElementById('passengerTo').value;
        const seat = document.getElementById('seatNumber').value;
        if (name && from && to && seat) {
            const seatElement = Array.from(seatGrid.children).find(s => s.textContent === seat || s.dataset.seat === seat);
            if (seatElement) {
                seatElement.classList.remove('available', 'connecting-seat');
                seatElement.classList.add('booked');
                seatElement.textContent = name; // عرض الاسم على المقعد
                seatElement.dataset.seat = seat; // حفظ رقم المقعد في dataset
                passengers.push({ seat, name, from, to });
                updatePassengerList();
                passengerModal.hide();
                document.getElementById('passengerName').value = '';
                document.getElementById('passengerFrom').selectedIndex = 0;
                document.getElementById('passengerTo').selectedIndex = 0;
            }
        }
    });

    // تحديث قائمة الركاب
    function updatePassengerList() {
        passengerItems.innerHTML = '';
        passengers.forEach((passenger, index) => {
            const li = document.createElement('li');
            li.className = 'passenger-item';
            li.innerHTML = `
                <div class="passenger-details">
                    <span>مقعد ${passenger.seat}: ${passenger.name}</span>
                    <br>
                    <small>من: ${passenger.from} | إلى: ${passenger.to}</small>
                </div>
                <div>
                    <button class="btn btn-sm btn-primary" onclick="editPassenger(${index})"><i class="fas fa-edit"></i> تعديل</button>
                    <button class="btn btn-sm btn-danger" onclick="deletePassenger(${index})"><i class="fas fa-trash"></i> حذف</button>
                </div>
            `;
            passengerItems.appendChild(li);
        });
    }

    // تعديل اسم الراكب والمدن
    window.editPassenger = function(index) {
        const passenger = passengers[index];
        document.getElementById('editPassengerName').value = passenger.name;
        document.getElementById('editPassengerFrom').value = passenger.from;
        document.getElementById('editPassengerTo').value = passenger.to;
        document.getElementById('editSeatNumber').value = passenger.seat;
        editPassengerModal.show();
    };

    // حفظ التعديل وعرض الاسم الجديد على المقعد
    document.getElementById('updatePassenger').addEventListener('click', () => {
        const name = document.getElementById('editPassengerName').value;
        const from = document.getElementById('editPassengerFrom').value;
        const to = document.getElementById('editPassengerTo').value;
        const seat = document.getElementById('editSeatNumber').value;
        if (name && from && to && seat) {
            const index = passengers.findIndex(p => p.seat === seat);
            if (index !== -1) {
                passengers[index] = { seat, name, from, to };
                const seatElement = Array.from(seatGrid.children).find(s => s.dataset.seat === seat);
                if (seatElement) {
                    seatElement.textContent = name; // تحديث الاسم على المقعد
                }
                updatePassengerList();
                editPassengerModal.hide();
            }
        }
    });

    // حذف راكب وإعادة رقم المقعد
    window.deletePassenger = function(index) {
        const passenger = passengers[index];
        const seatElement = Array.from(seatGrid.children).find(s => s.dataset.seat === passenger.seat);
        if (seatElement) {
            seatElement.classList.remove('booked');
            seatElement.classList.add('available');
            seatElement.textContent = passenger.seat; // إعادة رقم المقعد
            delete seatElement.dataset.seat; // حذف البيانات المخزنة
        }
        passengers.splice(index, 1);
        updatePassengerList();
    };
});