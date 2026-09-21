document.addEventListener('alpine:init', () => {
    
    const FREE_SHIPPING_THRESHOLD = 3000;

    // Global Cart Store
    Alpine.store('cart', {
        items: [],
        open: false,
        checkoutModalOpen: false,
        add(product, option) {
            const existing = this.items.find(i => i.id === product.id && i.option.weight === option.weight);
            if (existing) {
                existing.quantity++;
            } else {
                this.items.push({ 
                    id: product.id, 
                    name: product.name, 
                    image: product.image, 
                    option: option, 
                    quantity: 1 
                });
            }
            this.open = true;
        },
        remove(id, weight) {
            this.items = this.items.filter(i => !(i.id === id && i.option.weight === weight));
        },
        updateQuantity(id, weight, amount) {
            const item = this.items.find(i => i.id === id && i.option.weight === weight);
            if (item) {
                item.quantity += amount;
                if (item.quantity <= 0) {
                    this.remove(id, weight);
                }
            }
        },
        get subtotal() {
            return this.items.reduce((sum, item) => sum + (item.option.price * item.quantity), 0);
        },
        get count() {
            return this.items.reduce((sum, item) => sum + item.quantity, 0);
        },
        get progressToFreeShipping() {
            if (this.subtotal >= FREE_SHIPPING_THRESHOLD) return 100;
            return (this.subtotal / FREE_SHIPPING_THRESHOLD) * 100;
        },
        get amountForFreeShipping() {
            if (this.subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
            return FREE_SHIPPING_THRESHOLD - this.subtotal;
        }
    });

    // Checkout Form Data
    Alpine.data('checkout', () => ({
        form: {
            name: '',
            whatsapp: '',
            address: ''
        },
        status: 'idle', // idle, loading, success
        submitOrder() {
            if (!this.form.name || !this.form.whatsapp || !this.form.address) return;
            this.status = 'loading';
            // Simulate API call
            setTimeout(() => {
                this.status = 'success';
                Alpine.store('cart').items = []; // clear cart
            }, 1500);
        },
        close() {
            Alpine.store('cart').checkoutModalOpen = false;
            if (this.status === 'success') {
                this.status = 'idle';
                this.form = { name: '', whatsapp: '', address: '' };
                Alpine.store('cart').open = false;
            }
        }
    }));

    // Shop Data
    Alpine.data('shop', () => ({
        activeMood: 'Morning Energy',
        moods: ['Morning Energy', 'Deep Focus', 'Evening Calm', 'Digestive Comfort'],
        products: [
            { 
                id: 1, 
                name: "Karak Chai Blend", 
                mood: "Morning Energy",
                notes: ["Malt", "Cardamom", "Bold"],
                image: "assets/images/karak_chai_1790015593102.jpg", 
                options: [
                    { weight: "250g Pouch", price: 850 },
                    { weight: "500g Pouch", price: 1600 },
                    { weight: "1kg Tin Box", price: 3200 }
                ],
                selectedOptionIndex: 0
            },
            { 
                id: 2, 
                name: "Royal Green Flush", 
                mood: "Deep Focus",
                notes: ["Fresh Earth", "Vegetal", "Smooth"],
                image: "assets/images/green_tea_1790015604029.jpg", 
                options: [
                    { weight: "250g Pouch", price: 1200 },
                    { weight: "500g Tin Box", price: 2500 }
                ],
                selectedOptionIndex: 0
            },
            { 
                id: 3, 
                name: "Midnight Black", 
                mood: "Morning Energy",
                notes: ["Oak", "Cocoa", "Robust"],
                image: "assets/images/black_tea_1790015614823.jpg", 
                options: [
                    { weight: "250g Pouch", price: 950 },
                    { weight: "500g Pouch", price: 1800 },
                    { weight: "1kg Tin Box", price: 3600 }
                ],
                selectedOptionIndex: 0
            },
            { 
                id: 4, 
                name: "Chamomile Whisper", 
                mood: "Evening Calm",
                notes: ["Floral", "Honey", "Soothing"],
                image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
                options: [
                    { weight: "100g Tin Box", price: 1100 },
                    { weight: "250g Pouch", price: 2100 }
                ],
                selectedOptionIndex: 0
            },
            { 
                id: 5, 
                name: "Ginger Fennel Digest", 
                mood: "Digestive Comfort",
                notes: ["Spicy", "Sweet", "Cleansing"],
                image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
                options: [
                    { weight: "150g Pouch", price: 900 },
                    { weight: "300g Tin Box", price: 1900 }
                ],
                selectedOptionIndex: 0
            },
            { 
                id: 6, 
                name: "Oolong Serenity", 
                mood: "Deep Focus",
                notes: ["Orchid", "Roasted", "Complex"],
                image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
                options: [
                    { weight: "200g Tin Box", price: 1500 },
                    { weight: "500g Tin Box", price: 3500 }
                ],
                selectedOptionIndex: 0
            }
        ],
        get filteredProducts() {
            return this.products.filter(p => p.mood === this.activeMood);
        },
        formatPrice(price) {
            return `Rs. ${price.toLocaleString()}`;
        }
    }));

    // Live Brewing Timer Data
    Alpine.data('sommelier', () => ({
        activeTea: 'Black Tea',
        teas: [
            { name: 'Black Tea', temp: '95°C', ratio: '2.5g / 200ml', time: 180 }, // 3 mins
            { name: 'Green Tea', temp: '80°C', ratio: '2g / 200ml', time: 120 }, // 2 mins
            { name: 'Herbal', temp: '100°C', ratio: '3g / 200ml', time: 300 }, // 5 mins
            { name: 'Oolong', temp: '90°C', ratio: '2.5g / 200ml', time: 240 } // 4 mins
        ],
        get currentTeaData() {
            return this.teas.find(t => t.name === this.activeTea);
        },
        timerState: 'stopped', // stopped, running, paused, finished
        timeLeft: 180,
        interval: null,
        selectTea(teaName) {
            if(this.timerState === 'running') this.stopTimer();
            this.activeTea = teaName;
            this.timeLeft = this.currentTeaData.time;
            this.timerState = 'stopped';
        },
        get formattedTime() {
            const m = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
            const s = (this.timeLeft % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        },
        get progressPercentage() {
            const total = this.currentTeaData.time;
            return ((total - this.timeLeft) / total) * 100;
        },
        startTimer() {
            if(this.timerState === 'finished') this.timeLeft = this.currentTeaData.time;
            this.timerState = 'running';
            this.interval = setInterval(() => {
                if (this.timeLeft > 0) {
                    this.timeLeft--;
                } else {
                    this.timerState = 'finished';
                    clearInterval(this.interval);
                }
            }, 1000);
        },
        pauseTimer() {
            this.timerState = 'paused';
            clearInterval(this.interval);
        },
        stopTimer() {
            this.timerState = 'stopped';
            clearInterval(this.interval);
            this.timeLeft = this.currentTeaData.time;
        }
    }));

});
