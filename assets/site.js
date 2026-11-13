(function () {
  "use strict";

  /* 移动端导航：展开后点击链接或按 Esc 收起，滚动时锁定状态 */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "收起导航菜单" : "展开导航菜单");
    });

    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* 产品分类筛选：无 JS 时所有产品默认展示，按钮仅作为增强 */
  var filterBar = document.querySelector(".filter-bar");
  var grid = document.getElementById("product-grid");
  var empty = document.getElementById("product-empty");

  if (filterBar && grid && empty) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".product-card"));

    function applyFilter(cat) {
      var visible = 0;
      cards.forEach(function (card) {
        var match = cat === "all" || card.dataset.category === cat;
        card.hidden = !match;
        if (match) visible++;
      });
      empty.hidden = visible !== 0;

      Array.prototype.forEach.call(filterBar.querySelectorAll(".filter-btn"), function (btn) {
        btn.setAttribute("aria-pressed", btn.dataset.cat === cat ? "true" : "false");
      });
    }

    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      applyFilter(btn.dataset.cat);
    });

    // 从首页带 ?cat=xxx 进来时自动选中对应分类
    var requested = new URLSearchParams(location.search).get("cat");
    if (requested) {
      var match = filterBar.querySelector('.filter-btn[data-cat="' + requested + '"]');
      if (match) applyFilter(requested);
    }
  }

  /* 产品详情图廊 */
  var thumbs = document.getElementById("gallery-thumbs");
  var mainImg = document.getElementById("gallery-main-img");

  if (thumbs && mainImg) {
    thumbs.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-src]");
      if (!btn) return;
      mainImg.src = btn.dataset.src;
      Array.prototype.forEach.call(thumbs.querySelectorAll("button"), function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
    });
  }

  /* 留言表单校验 */
  var form = document.getElementById("contact-form");

  if (form && window.FormValidator) {
    var status = document.getElementById("form-status");

    function showErrors(errors) {
      Array.prototype.forEach.call(form.querySelectorAll("[data-error-for]"), function (el) {
        var name = el.getAttribute("data-error-for");
        var field = form.querySelector('[name="' + name + '"]');
        var msg = errors[name] || "";
        el.textContent = msg;
        if (field) {
          if (msg) field.setAttribute("aria-invalid", "true");
          else field.removeAttribute("aria-invalid");
        }
      });
    }

    function validate() {
      var values = {};
      Array.prototype.forEach.call(form.querySelectorAll("[name]"), function (el) {
        values[el.name] = el.value;
      });
      var result = window.FormValidator.validateAll(values);
      showErrors(result.errors);
      return result;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var result = validate();
      if (!result.valid) {
        status.textContent = "请修正标红的字段后再提交。";
        status.className = "form-status err";
        var firstError = form.querySelector('[aria-invalid="true"]');
        if (firstError) firstError.focus();
        return;
      }
      status.textContent = "留言已记录，我们会尽快与您联系。";
      status.className = "form-status ok";
      form.reset();
      showErrors({});
    });

    form.addEventListener("blur", function (e) {
      var el = e.target;
      if (!el.name || !window.FormValidator.RULES[el.name]) return;
      var r = window.FormValidator.validateField(el.name, el.value);
      var slot = form.querySelector('[data-error-for="' + el.name + '"]');
      if (slot) slot.textContent = r.message;
      if (r.message) el.setAttribute("aria-invalid", "true");
      else el.removeAttribute("aria-invalid");
    }, true);
  }
})();
