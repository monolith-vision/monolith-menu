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
    if IsNuiFocused() then
      return;
    end

    SendNUIMessage({ action = name });
  end

  for name, data in next, keys do
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
end);
