# monolith-menu

# Types
```ts
type MenuComponentTypes = 'placeholder' | 'button' | 'submenu' | 'slider' | 'list' | 'checkbox';
type MenuComponentAction = 'change' | 'click' | 'check';
type MenuPositions = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface MenuComponentJSON {
  __events: { [key: string]: function[] };
  id: string;
  type: MenuComponentTypes;
  label: string;
  description?: string;
  values?: string[];
  value?: number;
  step?: number;
  min?: number;
  max?: number;
  checked?: boolean;
  subMenuId?: string;
}

interface MenuComponent extends MenuComponentJSON {
  private on: (self: this, action: MenuComponentAction, func: function) => void;
  Trigger: (self: this, action: MenuComponentAction, ...: any) => void;
  OnChange: (self: this, func: (current: number | string, index?: number) => void) => void;
  OnClick: (self: this, func: () => void) => void;
  OnCheck: (self: this, func: (checked: boolean) => void) => void;
}

interface MenuJSON {
  __resource: string;
  __index: number;
  id: string;
  title: string;
  description?: string;
  position: MenuPositions;
  banner?: string;
  components: MenuComponent[];
}

interface Menu extends MenuJSON {
  private addComponent: (self: this, componentType: MenuComponentTypes, label: string, description?: string, values?: string[], value?: number, step?: number, min?: number, max?: number, checked?: boolean, subMenuId?: string) => MenuComponent;
  FindComponent: (self: this, value: string) => MenuComponent | undefined;
  RemoveComponent: (self: this, component: MenuComponentJSON) => boolean;
  AddPlaceholder: (self: this, label: string) => MenuComponent
  AddButton: (self: this, label: string, description: string?) => MenuComponent
  AddSubmenu: (self: this, subMenu: MenuJSON | Menu, label: string, description?: string) => MenuComponent
  AddSlider: (self: this, label: string, description?: string, value?: number, min?: number, max?: number, step?: number) => MenuComponent;
  AddCheckbox: (self: this, label: string, description?: string, checked?: boolean) => MenuComponent
  AddList: (self: this, label: string, description?: string, values: string[], value?: number) => MenuComponent
  Show: (self: this) => void;
  Hide: () => void;
  componentsToJSON: (self: self) => MenuComponentJSON[];
  toJSON: (self: self) => MenuJSON;
}
```

# Menu API
### UUID
- Creates an UUID
```ts
Menu.UUID(self: this): string
```

### Show
- Shows the specified Menu
```ts
Menu.Show(self: this, menu: MenuJSON | Menu);
```

### Hide
- Hides all Menus
```ts
Menu.Hide(self: this);
```

### Find
- Finds a Menu using the id of it
```ts
Menu.Find(self: this, value: string): Menu?
```

### <a name="Create"></a> Create
- Creates a new Menu
```ts
Menu.Create(self: this, title: string, description?: string, position?: MenuPositions, banner?: string): Menu
```

# Menu Functions
- menu refers to the return value of [Menu#Create](#Create)

### FindComponent
- Finds a Menu Component using the type, or id of it
```ts
menu.FindComponent(self: this, value: string): MenuComponent?
```

### RemoveComponent
- Removes the specified Component from the Menu
```ts
menu.RemoveComponent(self: this, component: MenuComponentJSON | MenuComponent): boolean
```

### <a name="AddPlaceholder"></a> AddPlaceholder
- Adds a text, which is centered and can't be selected
```ts
menu.AddPlaceholder(self: this, label: string): MenuComponent
```

### <a name="AddButton"></a> AddButton
- Adds a button
```ts
menu.AddButton(self: this, label: string, description?: string): MenuComponent
```

### <a name="AddSubmenu"></a> AddSubmenu
- Adds a button, which opens another menu upon click
```ts
menu.AddSubmenu(self: this, subMenu: MenuJSON | Menu, label: string, description?: string): MenuComponent
```

### <a name="AddSlider"></a> AddSlider
- Adds an range input
```ts
menu.AddSlider(self: this, label: string, description?: string, value: number, min?: number, max: number, step?: number): MenuComponent
```

### <a name="AddCheckbox"></a> AddCheckbox
- Adds a checkbox
```ts
menu.AddCheckbox(self: this, label: string, description?: string, checked?: boolean): MenuComponent
```

### <a name="AddList"></a> AddList
- Adds a list
```ts
menu.AddList(self: this, label: string, description?: string, values: string[], value?: number): MenuComponent
```

### Show
- Shows the current menu
```ts
menu.Show(self: this)
```

### Hide
- Hides all menus
```ts
menu.Hide(self: this)
```

### componentsToJSON
- Strips all functions of of the Menu Components
```ts
menu.componentsToJSON(self: this): MenuComponentsJSON[]
```

### toJSON
- Strips all functions of of the Menu
```ts
menu.toJSON(self: this): MenuJSON
```

# Components API
- component refers to the return value of [AddPlaceholder](#AddPlaceholder)/[AddButton](#AddButton)/[AddSubmenu](#AddSubmenu)/[AddSlider](#AddSlider)/[AddCheckbox](#AddCheckbox)/[AddList](#AddList)

### OnClick
- Gets executed when a button, or submenu Component gets clicked
```ts
menu.OnClick(self: this, () => {})
```

### OnCheck
- Gets executed when a checkbox is toggled
```ts
menu.OnCheck(self: this, (checked: boolean) => {})
```

### OnChange
- Gets executed when a slider, or list value is changed. If it's a slider, `current` will be a `number` and `index` `nil`
```ts
menu.OnChange(self: this, (current: number | string, index?: number) => {})
```

# Example Usage
`fxmanifest.lua`
```lua
client_scripts {
  '@monolith-menu/menu.lua',
  'client.lua'
}
```

`client.lua`
```lua
RegisterCommand('example', function()
  local menu = Menu:Create('Title', 'Description', 'top-right', '#ffffff');
  local subMenu = Menu:Create('Submenu Title', 'Description', 'top-right', '#ad43ff');

  subMenu:AddButton('Close', 'Close the example'):OnClick(function()
    Menu:Hide();
  end);

  menu:AddButton('Button', 'Description'):OnClick(function()
    print('Button clicked')
  end);
  menu:AddCheckbox('Checkbox', 'Description', true):OnCheck(function(checked)
    print('Is Checked', checked);
  end);
  menu:AddList('List', 'Description', { 'Item 1', 'Item 2', 'Item 3' }, 2):OnChange(function(current, index)
    -- current will be a string and index a number
    print(current, index);
  end);
  menu:AddPlaceholder('Placeholder');
  menu:AddSlider('Slider', 'Description', 20, 0, 30, 10):OnChange(function(current)
    -- current will be of type number
    print(current);
  end);

  menu:AddSubmenu(subMenu, 'Submenu', 'Description');

  menu:Show();
end, false);
```