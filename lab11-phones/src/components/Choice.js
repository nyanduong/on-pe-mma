import {useState} from 'react';
import {View, Text, Pressable} from 'react-native';

export default function Choice({label, value, options, onChange}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{marginVertical: 4}}>
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(!open)}
        style={{padding: 10, backgroundColor: '#def0ec'}}
      >
        <Text>
          {label}: {value || 'Select'} ▾
        </Text>
      </Pressable>
      {open &&
        options.map((option) => (
          <Text
            key={option}
            style={{padding: 10, backgroundColor: 'white'}}
            onPress={() => {
              onChange(option);
              setOpen(false);
            }}
          >
            {option}
          </Text>
        ))}
    </View>
  );
}
