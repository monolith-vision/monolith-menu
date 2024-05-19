local resources = {};

exports('SendNUIMessage', function(message)
  local resource = GetInvokingResource();

  if resource == nil or resource == 'monolith-menu' then
    return;
  end

  resources[resource] = true;

  SendNUIMessage(message);
end);

exports('SetNuiFocus', SetNuiFocus);

local nuiCallbacks = {
  dialog = {
    'Submit',
    'Close'
  },
  menu = {
    'onChange',
    'onCheck',
    'onClick',
    'onComponentSelect',
    'Back',
    'Exit'
  }
};

for prefix, callbacks in next, nuiCallbacks do
  for _, name in next, callbacks do
    RegisterNUICallback(prefix .. ':' .. name, function(req, resp)
      if not req[prefix] or not req[prefix].__resource then
        return resp('OK');
      end

      local import <const> = exports[req[prefix].__resource];

      if not import then
        return resp('OK');
      end

      import:OnNUICallback(prefix, name, req, resp);
    end);
  end
end

AddEventHandler('onResourceStop', function(resource)
  if resources[resource] then
    SendNUIMessage({ action = 'SetMenu' });
    SendNUIMessage({ action = 'SetDialog' });
  end
end);
