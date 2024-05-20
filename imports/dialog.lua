---@alias DialogComponentTypes "number" | "text" | "password" | "color" | "date" | "checkbox" | "textarea" | "select"

---@alias ColorArray number[]

---@class SelectValue
---@field label string?
---@field value string

---@alias DialogComponentValues string | number | boolean | ColorArray | SelectValue

---@class DialogComponent
---@field componentType DialogComponentTypes
---@field componentLabel string
---@field componentDescription string
---@field placeholder string
---@field values SelectValue[]?
---@field value DialogComponentValues?
---@field defaultValue DialogComponentValues?
---@field min number?
---@field max number?
---@field required boolean?

---@class Dialog
---@field __resource string,
---@field id string
---@field title string,
---@field description string?
---@field components DialogComponent[]
---@field submitLabel string?
---@field cancelLabel string?

local RESOURCE <const> = GetCurrentResourceName();
local import <const> = exports['monolith-menu'];

---@type fun(message: any)
local SendNUIMessage <const> = function(message)
  import:SendNUIMessage(message);
end

---@type fun(hasFocus: boolean, hasCursor: boolean)
local SetNuiFocus <const> = function(hasFocus, hasCursor)
  import:SetNuiFocus(hasFocus, hasCursor);
end

Dialog = {
  cachedPromises = {},
  current = nil
};

---@param template string
---@return string
function Dialog:UUID(template)
  local uuid <const> = string.gsub(template, '[xy]', function(c)
    local v = (c == 'x') and math.random(0, 0xf) or math.random(8, 0xb);

    return string.format('%x', v);
  end);

  return uuid;
end

---@param dialogTitle string
---@param dialogDescription string?
---@param submitLabel string?
---@param cancelLabel string?
function Dialog:Create(dialogTitle, dialogDescription, submitLabel, cancelLabel)
  local dialog = {
    __resource = RESOURCE,
    id = self:UUID('dialog_xxyyxx-yyxxyy'),
    title = dialogTitle,
    description = dialogDescription,
    components = {},
    submitLabel = submitLabel,
    cancelLabel = cancelLabel,
  };

  ---@private
  ---@param type DialogComponentTypes
  ---@param label string
  ---@param description string?
  ---@param placeholder string?
  ---@param values SelectValue[]?
  ---@param defaultValue DialogComponentValues?
  ---@param min number?
  ---@param max number?
  ---@param required boolean?
  ---@return DialogComponent
  function dialog:addComponent(type, label, description, placeholder, values, defaultValue, min, max, required)
    local component = {
      id = Dialog:UUID('component-' .. type .. '_xxyyxx-yyxxyy'),
      type = type,
      label = label,
      description = description,
      placeholder = placeholder,
      valid = false,
      values = values,
      value = nil,
      defaultValue = defaultValue,
      min = min,
      max = max,
      required = required
    };

    self.components[#self.components + 1] = component;

    return component;
  end

  ---@param label string
  ---@param description string?
  ---@param placeholder string?
  ---@param defaultValue string?
  ---@param minLength number?
  ---@param maxLength number?
  ---@param required boolean?
  ---@return DialogComponent
  function dialog:AddInput(label, description, placeholder, defaultValue, minLength, maxLength, required)
    return self:addComponent('text', label, description, placeholder, nil, defaultValue, minLength, maxLength, required);
  end

  ---@param label string
  ---@param description string?
  ---@param placeholder string?
  ---@param defaultValue number?
  ---@param minLength number?
  ---@param maxLength number?
  ---@param required boolean?
  ---@return DialogComponent
  function dialog:AddNumberInput(label, description, placeholder, defaultValue, minLength, maxLength, required)
    return self:addComponent('number', label, description, placeholder, nil, defaultValue, minLength, maxLength, required);
  end

  ---@param label string
  ---@param description string?
  ---@param placeholder string?
  ---@param defaultValue string?
  ---@param minLength number?
  ---@param maxLength number?
  ---@param required boolean?
  ---@return DialogComponent
  function dialog:AddPasswordInput(label, description, placeholder, defaultValue, minLength, maxLength, required)
    return self:addComponent('password', label, description, placeholder, nil, defaultValue, minLength, maxLength,
      required);
  end

  ---@param label string
  ---@param description string?
  ---@param defaultValue ColorArray?
  ---@return DialogComponent
  function dialog:AddColorInput(label, description, defaultValue)
    return self:addComponent('color', label, description, nil, nil, defaultValue, nil, nil, true);
  end

  ---@param label string
  ---@param description string?
  ---@param placeholder string?
  ---@param defaultValue number?
  ---@param required boolean?
  ---@return DialogComponent
  function dialog:AddDateInput(label, description, placeholder, defaultValue, required)
    return self:addComponent('date', label, description, placeholder, nil, defaultValue, nil, nil, required);
  end

  ---@param label string
  ---@param description string?
  ---@param defaultValue boolean?
  ---@param required boolean?
  ---@return DialogComponent
  function dialog:AddCheckbox(label, description, defaultValue, required)
    return self:addComponent('checkbox', label, description, nil, nil, defaultValue, nil, nil, required);
  end

  ---@param label string
  ---@param description string?
  ---@param placeholder string?
  ---@param defaultValue string?
  ---@param minLength number?
  ---@param maxLength number?
  ---@param required boolean?
  ---@return DialogComponent
  function dialog:AddTextarea(label, description, placeholder, defaultValue, minLength, maxLength, required)
    return self:addComponent('textarea', label, description, placeholder, nil, defaultValue, minLength, maxLength,
      required);
  end

  ---@param label string
  ---@param description string?
  ---@param placeholder string?
  ---@param values SelectValue[]
  ---@param required boolean?
  ---@return DialogComponent
  function dialog:AddSelect(label, description, placeholder, values, required)
    return self:addComponent('select', label, description, placeholder, values, nil, nil, nil, required);
  end

  ---@return DialogComponent[]
  function dialog:componentsToJSON()
    local components = {};

    for _, component in next, self.components do
      components[_] = {
        id = component.id,
        type = component.type,
        label = component.label,
        description = component.description,
        placeholder = component.placeholder,
        valid = false,
        values = component.values,
        value = nil,
        defaultValue = component.defaultValue,
        min = component.min,
        max = component.max,
        required = component.required
      };
    end

    return components;
  end

  ---@return Dialog
  function dialog:toJSON()
    return {
      __resource = self.__resource,
      id = self.id,
      title = self.title,
      description = self.description,
      components = self:componentsToJSON(),
      submitLabel = self.submitLabel,
      cancelLabel = self.cancelLabel,
    };
  end

  function dialog:Open()
    if Dialog.current then
      return;
    end

    Dialog.current = self;
    Dialog.cachedPromises[self.id] = promise.new();

    Dialog:Show(self:toJSON());

    return Citizen.Await(Dialog.cachedPromises[self.id]);
  end

  return dialog;
end

---@param dialog Dialog
function Dialog:Show(dialog)
  SendNUIMessage({
    action = 'SetDialog',
    data = dialog
  });

  SetNuiFocus(true, true);
end

---@param action 'Close' | 'Submit'
---@param req { dialog: Dialog; values: DialogComponentValues[] }
---@param resp function
exports('OnDialogCallback', function(action, req, resp)
  SetNuiFocus(false, false);

  Dialog.cachedPromises[req.dialog.id]:resolve(req.values);

  resp('OK');
end);
