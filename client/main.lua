local menuResources = {};

exports('SendNUIMessage', function(message)
  local resource = GetInvokingResource();

  if resource == nil or resource == 'monolith-menu' then
    return;
  end

  menuResources[resource] = true;

  SendNUIMessage(message);
end);

local nuiCallbacks = {
  'onChange',
  'onCheck',
  'onClick',
  'onComponentSelect',
  'Back',
  'Exit'
};

for _, name in next, nuiCallbacks do
  RegisterNUICallback(name, function(req, resp)
    if not req.menu or not req.menu.__resource then
      SendNUIMessage({ action = 'SetMenu' });

      return resp('OK');
    end

    local import <const> = exports[req.menu.__resource];

    if not import then
      return resp('OK');
    end

    import:OnNUICallback(name, req, resp);
  end);
end

AddEventHandler('onResourceStop', function(resource)
  if menuResources[resource] then
    SendNUIMessage({ action = 'SetMenu' });
  end
end);
