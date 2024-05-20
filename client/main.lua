Resources = {};
Last = {
  menu = nil,
  dialog = nil
};

exports('SendNUIMessage', function(message)
  local resource = GetInvokingResource();

  if resource == nil or resource == 'monolith-menu' then
    return;
  end

  if not Resources[resource] then
    Resources[resource] = {
      menu = message.action == 'SetMenu' and message.data?.id,
      dialog = message.action == 'SetDialog' and message.data?.id,
    };
  end

  local prop = message.action == 'SetMenu' and 'menu' or 'dialog';
  Resources[resource][prop] = message.action == 'SetMenu' and message.data?.id;

  Last[prop] = message.data?.id;

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

      if prefix == 'menu' then
        import:OnMenuCallback(name, req, resp);

        if name == 'Exit' then
          Last.menu = nil;
        end

        return;
      end

      import:OnDialogCallback(name, req, resp);

      if name == 'Close' then
        Last.dialog = nil;
      end
    end);
  end
end

AddEventHandler('onResourceStop', function(resource)
  if not Resources[resource] then
    return;
  end

  if Resources[resource].menu == Last.menu then
    SendNUIMessage({ action = 'SetMenu' });
  end

  if Resources[resource].dialog == Last.dialog then
    SendNUIMessage({ action = 'SetDialog' });
  end
end);
