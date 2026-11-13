(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.FormValidator = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // 留言表单校验规则。抽成独立模块是为了浏览器与单元测试共用同一套判断，
  // 避免测试通过但页面行为不一致。
  var RULES = {
    name: {
      required: true,
      label: "姓名",
      min: 2,
      max: 20,
      message: "请填写姓名，2~20 个字符"
    },
    phone: {
      required: true,
      label: "手机",
      pattern: /^1[3-9]\d{9}$/,
      message: "请填写正确的 11 位手机号"
    },
    email: {
      required: false,
      label: "邮箱",
      pattern: /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(\.[\w-]+)+$/,
      message: "邮箱格式不正确"
    },
    message: {
      required: true,
      label: "留言内容",
      min: 5,
      max: 500,
      message: "请填写留言内容，5~500 个字符"
    }
  };

  function countLength(value) {
    return String(value === null || value === undefined ? "" : value).trim().length;
  }

  function validateField(name, rawValue) {
    var rule = RULES[name];
    if (!rule) return { ok: true, message: "" };
    var value = String(rawValue === null || rawValue === undefined ? "" : rawValue).trim();
    if (!value) {
      if (!rule.required) return { ok: true, message: "" };
      return { ok: false, message: rule.label + "不能为空" };
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      return { ok: false, message: rule.message };
    }
    if (rule.min !== undefined && countLength(value) < rule.min) {
      return { ok: false, message: rule.message };
    }
    if (rule.max !== undefined && countLength(value) > rule.max) {
      return { ok: false, message: rule.message };
    }
    return { ok: true, message: "" };
  }

  function validateAll(values) {
    var errors = {};
    var valid = true;
    Object.keys(RULES).forEach(function (name) {
      var result = validateField(name, values[name]);
      if (!result.ok) {
        errors[name] = result.message;
        valid = false;
      }
    });
    return { valid: valid, errors: errors };
  }

  return {
    RULES: RULES,
    validateField: validateField,
    validateAll: validateAll,
    countLength: countLength
  };
});
