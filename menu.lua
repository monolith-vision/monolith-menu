---@alias MenuComponentType 'placeholder' | 'button' | 'submenu' | 'slider' | 'list' | 'checkbox'
---@alias MenuComponentAction 'change' | 'click' | 'check'
---@alias MenuPosition 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

---@class MenuComponent
---@field __events { [string]: function[] }
---@field id string
---@field type MenuComponentType
---@field label string
---@field description string?
---@field values string[]?
---@field value number?
---@field step number?
---@field min number?
---@field max number?
---@field checked boolean?
---@field subMenuId string?

---@class Component:MenuComponent
---@field private on fun(self: self, action: MenuComponentAction, func: function)
---@field Trigger fun(self: self, action: MenuComponentAction, ...: any)
---@field OnChange fun(self: self, func: fun(current: number | string, index: number?))
---@field OnClick fun(self: self, func: fun())
---@field OnCheck fun(self: self, func: fun(checked: boolean))

---@class Menu
---@field __resource string
---@field __index number
---@field id string
---@field title string
---@field description string?
---@field position MenuPosition
---@field banner string?
---@field components Component[]

---@class MenuReturn:Menu
---@field private addComponent fun(self: self, componentType: MenuComponentType, label: string, description: string?, values: string[]?, value: number?, step: number?, min: number?, max: number?, checked: boolean?, subMenuId: string?): Component
---@field FindComponent fun(self: self, value: string): Component?
---@field RemoveComponent fun(self: self, component: MenuComponent): boolean
---@field AddPlaceholder fun(self: self, label: string): Component
---@field AddButton fun(self: self, label: string, description: string?): Component
---@field AddSubmenu fun(self: self, subMenu: Menu, label: string, description: string?): Component
---@field AddSlider fun(self: self, label: string, description: string?, value: number?, min: number?, max: number, step: number?): Component
---@field AddCheckbox fun(self: self, label: string, description: string?, checked?: boolean): Component
---@field AddList fun(self: self, label: string, description: string?, values: string[], value: number?): Component
---@field Show fun(self: self)
---@field Hide fun()
---@field componentsToJSON fun(self: self): MenuComponent[]
---@field toJSON fun(self: self): Menu

local RESOURCE <const> = GetCurrentResourceName();
local import <const> = exports['monolith-menu'];
local Console <const> = import:getLib();

---@type fun(message: any)
local SendNUIMessage <const> = function(message)
  import:SendNUIMessage(message);
end

Menu = {
  cached = {},
  last = {},
  current = nil
};

---@param template string
---@return string
function Menu:UUID(template)
  local uuid <const> = string.gsub(template, '[xy]', function(c)
    local v = (c == 'x') and math.random(0, 0xf) or math.random(8, 0xb);

    return string.format('%x', v);
  end);

  return uuid;
end

---@param menu Menu | MenuReturn
function Menu:Show(menu)
  self.current = menu;

  if menu.toJSON then
    ---@diagnostic disable-next-line: param-type-mismatch
    menu = menu:toJSON();
  end

  SendNUIMessage({
    action = 'SetMenu',
    data = { menu = menu },
  });
end

function Menu:Hide()
  self.current = nil;
  self.cached = {};
  self.last = {};

  SendNUIMessage({
    action = 'SetMenu',
    data = {}
  });
end

---@param value string
---@return MenuReturn?
function Menu:Find(value)
  if not value or type(value) ~= 'string' then
    return;
  end

  for _, menu in next, self.cached do
    if menu.id == value then
      return menu;
    end
  end
end

---@param menuTitle string
---@param menuDescription string?
---@param menuPosition MenuPosition?
---@param menuBanner string?
---@return MenuReturn
function Menu:Create(menuTitle, menuDescription, menuPosition, menuBanner)
  local menu = {
    __resource = RESOURCE,
    __index = #self.cached + 1,
    id = self:UUID('menu_xxyyxx-yyxxyy'),
    title = menuTitle,
    description = menuDescription,
    position = menuPosition or 'top-left',
    banner = menuBanner,
    ---@type Component[]
    components = {}
  };

  ---@private
  ---@param componentType MenuComponentType
  ---@param label string
  ---@param description string?
  ---@param values string[]?
  ---@param value number?
  ---@param step number?
  ---@param min number?
  ---@param max number?
  ---@param checked boolean?
  ---@param subMenuId string?
  function menu:addComponent(componentType, label, description, values, value, step, min, max, checked, subMenuId)
    local component = {
      ---@type { [string]: function[] }
      __events = {
        change = {},
        click = {},
        check = {}
      },
      id = Menu:UUID('component-' .. componentType .. '_xxyyxx-yyxxyy'),
      type = componentType,
      label = label,
      description = description,
      values = values,
      value = value,
      step = step,
      min = min,
      max = max,
      checked = checked,
      subMenuId = subMenuId
    };

    ---@private
    ---@param action MenuComponentAction
    ---@param func function
    function component:on(action, func)
      if not self.__events[action] then
        return Console.Error('`' .. action .. '` is not an valid event.');
      end

      self.__events[action][#self.__events[action] + 1] = func;
    end

    ---@param action MenuComponentAction
    function component:Trigger(action, ...)
      if not self.__events[action] then
        return;
      end

      for _, event in next, self.__events[action] do
        event(...);
      end
    end

    ---@param func fun(current: string | number, index: number)
    function component:OnChange(func)
      self:on('change', func);
    end

    ---@param func fun()
    function component:OnClick(func)
      self:on('click', func);
    end

    ---@param func fun(checked: boolean)
    function component:OnCheck(func)
      self:on('check', func);
    end

    self.components[#self.components + 1] = component;

    return component;
  end

  ---@param value string
  ---@return Component?
  function menu:FindComponent(value)
    for _, component in next, self.components do
      if component.id == value or component.type == value then
        return component;
      end
    end
  end

  ---@param component MenuComponent
  ---@return boolean
  function menu:RemoveComponent(component)
    if not component then
      return false;
    end

    for _, comp in next, self.components do
      if comp.id == component.id then
        table.remove(self.components, _);
        break;
      end
    end

    return true;
  end

  ---@param label string
  ---@return Component
  function menu:AddPlaceholder(label)
    return self:addComponent('placeholder', label);
  end

  ---@param label string
  ---@param description string?
  ---@return Component
  function menu:AddButton(label, description)
    return self:addComponent('button', label, description);
  end

  ---@param subMenu Menu
  ---@param label string
  ---@param description string?
  ---@return Component
  function menu:AddSubmenu(subMenu, label, description)
    return self:addComponent('submenu', label, description, nil, nil, nil, nil, nil, nil, subMenu.id);
  end

  ---@param label string
  ---@param description string?
  ---@param value number?
  ---@param min number?
  ---@param max number
  ---@param step number?
  ---@return Component
  function menu:AddSlider(label, description, value, min, max, step)
    return self:addComponent('slider', label, description, nil, value, step, min, max);
  end

  ---@param label string
  ---@param description string?
  ---@param values string[]
  ---@param value number?
  ---@return Component
  function menu:AddList(label, description, values, value)
    return self:addComponent('list', label, description, values, (value - 1) or 0);
  end

  ---@param label string
  ---@param description string?
  ---@param checked boolean?
  ---@return Component
  function menu:AddCheckbox(label, description, checked)
    return self:addComponent('checkbox', label, description, nil, nil, nil, nil, nil, checked or false);
  end

  function menu:Show()
    Menu:Show(self);
  end

  function menu:Hide()
    Menu:Hide();
  end

  ---@return MenuComponent[]
  function menu:componentsToJSON()
    local components = {};

    for _, component in next, self.components do
      components[_] = {
        __events = component.__events,
        id = component.id,
        type = component.type,
        label = component.label,
        description = component.description,
        values = component.values,
        value = component.value,
        step = component.step,
        min = component.min,
        max = component.max,
        checked = component.checked,
        subMenuId = component.subMenuId
      };
    end

    return components;
  end

  ---@return Menu
  function menu:toJSON()
    return {
      __resource = self.__resource,
      __index = self.__index,
      id = self.id,
      title = self.title,
      description = self.description,
      position = self.position,
      banner = self.banner,
      components = self:componentsToJSON(),
    }
  end

  self.cached[#self.cached + 1] = menu;

  return menu;
end

local needsComponents <const> = {
  onChange = true,
  onCheck = true,
  onClick = true
};

---@param action 'onChange' | 'onCheck' | 'onClick' | 'onComponentSelect' | 'Back' | 'Exit'
---@param req { component?: MenuComponent, menu: Menu }
---@param resp function
exports('OnNUICallback', function(action, req, resp)
  local menu = Menu:Find(req.menu.id);

  if not menu then
    return resp('OK');
  end

  if needsComponents[action] then
    local component = menu:FindComponent(req.component.id);

    if not component then
      return resp('OK');
    end

    if action == 'onChange' then
      PlaySoundFrontend(-1, 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);

      if component.type == 'slider' then
        component:Trigger('change', req.component.value);
      else
        component:Trigger('change', req.component.values[req.component.value + 1], req.component.value + 1);
      end
    elseif action == 'onCheck' then
      PlaySoundFrontend(-1, 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);

      component:Trigger('check', req.component.checked);
    elseif action == 'onClick' then
      PlaySoundFrontend(-1, 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);

      if component.type == 'submenu' and type(component.subMenuId) == 'string' then
        local submenu = Menu:Find(component.subMenuId);

        if not submenu then
          Console.Error('Submenu (' .. component.subMenuId .. ') does not exist');

          return resp('OK');
        end

        Menu.last[#Menu.last + 1] = req.menu.id;

        Menu:Show(submenu);
      end

      component:Trigger('click');
    elseif action == 'onComponentSelect' then
      PlaySoundFrontend(-1, 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
    end

    return resp('OK');
  end

  if action == 'Back' then
    local newMenu = Menu:Find(Menu.last[1]);

    if #Menu.last == 0 or not newMenu then
      Menu:Hide();
      return resp('OK');
    end

    Menu:Show(newMenu);
    table.remove(Menu.last, 1);
  elseif action == 'Exit' then
    Menu:Hide();
  end

  PlaySoundFrontend(-1, 'BACK', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);

  resp('OK');
end);

Citizen.CreateThreadNow(function()
  local keys = {
    ArrowUp = { key = 188, mapper = 'UP' },
    ArrowDown = { key = 187, mapper = 'DOWN' },
    ArrowLeft = { key = 189, mapper = 'LEFT' },
    ArrowRight = { key = 190, mapper = 'RIGHT' },
    Enter = { key = 191, mapper = 'RETURN' },
    Backspace = { key = 194, mapper = 'BACK' },
    Escape = { key = 200, mapper = 'ESCAPE' }
  };

  ---@param name string
  local function sendKey(name)
    SendNUIMessage({ action = name });
  end

  ---@param name string
  ---@param data { key: number; mapper: string }
  local function registerInput(name, data)
    RegisterCommand('menu:' .. name, function()
      if not Menu.current then
        return;
      end

      DisableControlAction(0, data.key, true);
      SetPauseMenuActive(false);

      repeat
        sendKey(name);

        if name == 'Escape' then
          return;
        end

        Citizen.Wait(120);
      until IsDisabledControlReleased(0, data.key)
    end, false);

    RegisterKeyMapping('menu:' .. name, name, 'keyboard', data.mapper);
  end

  for name, data in next, keys do
    registerInput(name, data);
  end
end);
