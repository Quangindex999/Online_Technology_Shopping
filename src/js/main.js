/**
 * JOBARIA E-commerce Website
 * Main JavaScript Module
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'jobaria_cart';

  /**
   * Utility Functions
   */
  const Utils = {
    /**
     * Debounce function
     */
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    /**
     * Validate email
     */
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    /**
     * Format price
     */
    formatPrice(price) {
      return `$${parseFloat(price).toFixed(2)}`;
    },
  };

  /**
   * Notification System
   */
  const Notification = {
    show(message, type = 'info') {
      const existing = document.querySelector('.notification');
      if (existing) existing.remove();

      const notification = document.createElement('div');
      notification.className = `notification notification--${type}`;
      notification.textContent = message;
      notification.setAttribute('role', 'alert');
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    },

    success(message) {
      this.show(message, 'success');
    },

    error(message) {
      this.show(message, 'error');
    },

    info(message) {
      this.show(message, 'info');
    },
  };

  /**
   * Slider Module
   */
  const Slider = {
    currentIndex: 0,
    autoPlayInterval: null,

    init() {
      const slider = document.querySelector('.hero-slider');
      if (!slider) return;

      const list = slider.querySelector('.list');
      const items = slider.querySelectorAll('.item');
      const dots = slider.querySelectorAll('.dots li');
      const prevBtn = slider.querySelector('#prev');
      const nextBtn = slider.querySelector('#next');

      if (!list || !items.length) return;

      const totalItems = items.length;

      const updateSlider = () => {
        const offset = items[this.currentIndex].offsetLeft;
        list.style.transform = `translateX(-${offset}px)`;

        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === this.currentIndex);
        });
      };

      const goToNext = () => {
        this.currentIndex = (this.currentIndex + 1) % totalItems;
        updateSlider();
      };

      const goToPrev = () => {
        this.currentIndex = (this.currentIndex - 1 + totalItems) % totalItems;
        updateSlider();
      };

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.stopAutoPlay();
          goToNext();
          this.startAutoPlay();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          this.stopAutoPlay();
          goToPrev();
          this.startAutoPlay();
        });
      }

      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          this.stopAutoPlay();
          this.currentIndex = index;
          updateSlider();
          this.startAutoPlay();
        });
      });

      this.startAutoPlay();
      updateSlider();
    },

    startAutoPlay() {
      this.autoPlayInterval = setInterval(() => {
        const slider = document.querySelector('.hero-slider');
        if (slider && document.visibilityState === 'visible') {
          const items = document.querySelectorAll('.hero-slider .item');
          if (items.length) {
            this.currentIndex = (this.currentIndex + 1) % items.length;
            const offset = items[this.currentIndex].offsetLeft;
            const list = document.querySelector('.hero-slider .list');
            const dots = document.querySelectorAll('.hero-slider .dots li');
            if (list) list.style.transform = `translateX(-${offset}px)`;
            dots.forEach((dot, i) => {
              dot.classList.toggle('active', i === this.currentIndex);
            });
          }
        }
      }, 5000);
    },

    stopAutoPlay() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      }
    },
  };

  /**
   * Product Tabs Module
   */
  const Tabs = {
    init() {
      const tabs = document.querySelectorAll('.tab-btn');
      const contents = document.querySelectorAll('.content');
      const line = document.querySelector('.line');

      if (!tabs.length || !contents.length) return;

      tabs.forEach((tab, index) => {
        tab.addEventListener('click', e => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          if (line) {
            line.style.width = `${tab.offsetWidth}px`;
            line.style.left = `${tab.offsetLeft}px`;
          }

          contents.forEach(c => c.classList.remove('active'));
          if (contents[index]) {
            contents[index].classList.add('active');
          }
        });
      });
    },
  };

  /**
   * Mobile Menu Module
   */
  const MobileMenu = {
    init() {
      const toggle = document.querySelector('.js-mobile-menu-toggle');
      const menu = document.querySelector('.mobile-menu');
      const overlay = document.querySelector('.mobile-menu-overlay');
      const closeBtn = document.querySelector('.js-mobile-menu-close');
      const submenuItems = document.querySelectorAll('.mobile-menu__list .has-submenu > a');

      if (!menu) return;

      const openMenu = () => {
        menu.classList.add('is-open');
        if (overlay) overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      };

      const closeMenu = () => {
        menu.classList.remove('is-open');
        if (overlay) overlay.classList.remove('is-open');
        document.body.style.overflow = '';
      };

      if (toggle) {
        toggle.addEventListener('click', e => {
          e.preventDefault();
          openMenu();
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', e => {
          e.preventDefault();
          closeMenu();
        });
      }

      if (overlay) {
        overlay.addEventListener('click', closeMenu);
      }

      submenuItems.forEach(item => {
        item.addEventListener('click', e => {
          e.preventDefault();
          const parent = item.parentElement;
          parent.classList.toggle('is-open');
        });
      });

      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) {
          closeMenu();
        }
      });
    },
  };

  /**
   * Sidebar Module (Desktop)
   */
  const Sidebar = {
    init() {
      const sidebar = document.querySelector('.sidebar');
      const toggleBtn = document.querySelector('.js-sidebar-toggle');
      const closeBtn = document.querySelector('.js-sidebar-close');

      if (!sidebar) return;

      if (toggleBtn) {
        toggleBtn.addEventListener('click', e => {
          e.preventDefault();
          sidebar.classList.add('is-open');
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', e => {
          e.preventDefault();
          sidebar.classList.remove('is-open');
        });
      }

      sidebar.addEventListener('click', e => {
        if (e.target === sidebar) {
          sidebar.classList.remove('is-open');
        }
      });
    },
  };

  /**
   * Forms Module
   */
  const Forms = {
    init() {
      this.initNewsletter();
      this.initSearch();
    },

    initNewsletter() {
      const form = document.querySelector('.newsletter-form form');
      if (!form) return;

      form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const email = input ? input.value.trim() : '';

        if (!email) {
          Notification.error('Vui lòng nhập địa chỉ email');
          return;
        }

        if (!Utils.isValidEmail(email)) {
          Notification.error('Email không hợp lệ');
          return;
        }

        Notification.success('Cảm ơn bạn đã đăng ký!');
        form.reset();
      });
    },

    initSearch() {
      const form = document.querySelector('.header-search__box');
      if (!form) return;

      form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('input[type="search"]');
        const query = input ? input.value.trim() : '';

        if (!query) {
          Notification.error('Vui lòng nhập từ khóa tìm kiếm');
          return;
        }

        if (query.length < 2) {
          Notification.error('Từ khóa phải có ít nhất 2 ký tự');
          return;
        }

        Notification.info(`Đang tìm: "${query}"`);
      });
    },
  };

  /**
   * Cart Module
   */
  const Cart = {
    items: [],

    init() {
      this.load();
      this.bindEvents();
      this.updateUI();
    },

    load() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.items = JSON.parse(stored);
        }
      } catch (e) {
        console.error('Error loading cart:', e);
        this.items = [];
      }
    },

    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
      } catch (e) {
        console.error('Error saving cart:', e);
      }
    },

    bindEvents() {
      const self = this;

      document.addEventListener('click', function (e) {
        // Add to cart
        const addBtn = e.target.closest('.add-to-cart a');
        if (addBtn) {
          e.preventDefault();
          const card = addBtn.closest('.product-card') || addBtn.closest('.product-items');
          if (card) {
            const product = self.getProductData(card);
            self.add(product);
          }
        }

        // Remove from cart
        const removeBtn = e.target.closest('.js-remove-item');
        if (removeBtn) {
          e.preventDefault();
          const id = removeBtn.dataset.id;
          if (id) self.remove(id);
        }

        // Quantity buttons
        const qtyBtn = e.target.closest('.js-qty-btn');
        if (qtyBtn) {
          const id = qtyBtn.dataset.id;
          const action = qtyBtn.dataset.action;
          const item = self.items.find(function (i) {
            return i.id === id;
          });
          if (item) {
            if (action === 'increase') {
              item.quantity += 1;
            } else if (action === 'decrease') {
              item.quantity = Math.max(0, item.quantity - 1);
              if (item.quantity === 0) {
                self.remove(id);
                return;
              }
            }
            self.save();
            self.updateUI();
          }
        }
      });
    },

    getProductData(card) {
      const nameEl = card.querySelector('.product-name');
      const priceEl = card.querySelector('.new-price');
      const imgEl = card.querySelector('.product-img img') || card.querySelector('img');

      const name = nameEl ? nameEl.textContent.trim() : 'Sản phẩm';
      const priceText = priceEl ? priceEl.textContent.replace(/[^0-9.]/g, '') : '0';
      const price = parseFloat(priceText) || 0;
      const image = imgEl ? imgEl.src : '';

      return {
        id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: name,
        price: price,
        image: image,
        quantity: 1,
      };
    },

    add(product) {
      const existing = this.items.find(function (item) {
        return item.name === product.name;
      });

      if (existing) {
        existing.quantity += 1;
      } else {
        this.items.push(product);
      }

      this.save();
      this.updateUI();
      Notification.success('Đã thêm "' + product.name + '" vào giỏ hàng!');
    },

    remove(id) {
      const item = this.items.find(function (i) {
        return i.id === id;
      });
      if (item) {
        this.items = this.items.filter(function (i) {
          return i.id !== id;
        });
        this.save();
        this.updateUI();
        Notification.info('Đã xóa sản phẩm khỏi giỏ hàng');
      }
    },

    updateUI() {
      const totalItems = this.items.reduce(function (sum, item) {
        return sum + item.quantity;
      }, 0);
      const totalPrice = this.items.reduce(function (sum, item) {
        return sum + item.price * item.quantity;
      }, 0);

      const cartCount = document.querySelector('.cart-count');
      if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
      }

      const cartTotal = document.querySelector('.cart-total');
      if (cartTotal) {
        cartTotal.textContent = Utils.formatPrice(totalPrice);
      }
    },

    getTotal() {
      return {
        items: this.items.reduce(function (sum, item) {
          return sum + item.quantity;
        }, 0),
        price: this.items.reduce(function (sum, item) {
          return sum + item.price * item.quantity;
        }, 0),
      };
    },
  };

  /**
   * Initialize Application
   */
  const App = {
    init() {
      Slider.init();
      Tabs.init();
      MobileMenu.init();
      Sidebar.init();
      Forms.init();
      Cart.init();
    },
  };

  // Start app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      App.init();
    });
  } else {
    App.init();
  }

  // Expose to global scope
  window.JOBARIA = {
    Cart: Cart,
    Notification: Notification,
    Slider: Slider,
    Tabs: Tabs,
    MobileMenu: MobileMenu,
    Forms: Forms,
    Utils: Utils,
  };
})();
