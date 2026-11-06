import { useState } from 'react';
import { ScrollView, Text, Pressable, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { monthSummary, useExpenses } from '../data/expenses';

const colors = ['#186653', '#cc742d', '#415ea2', '#ab4275'];
function point(angle) {
  return [100 + 94 * Math.cos(angle), 100 + 94 * Math.sin(angle)].join(' ');
}
export default function SummaryScreen({ navigation }) {
  const { rows } = useExpenses(),
    [selected, select] = useState(null);
  const now = new Date(),
    { expenses, groups, total } = monthSummary(rows, now);
  let start = -Math.PI / 2;
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18 }}>
        {now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
      </Text>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Total: {total.toLocaleString()}
      </Text>
      {total > 0 ? (
        <Svg width="100%" height={210} viewBox="0 0 200 200">
          {groups.map(([category, value], index) => {
            const from = start;
            start += (2 * Math.PI * value) / total;
            const props = {
              fill: colors[index % colors.length],
              onPress: () => select(category),
            };
            if (groups.length === 1)
              return (
                <Circle key={category} cx={100} cy={100} r={94} {...props} />
              );
            const arc =
              'M 100 100 L ' +
              point(from) +
              ' A 94 94 0 ' +
              (value / total > 0.5 ? 1 : 0) +
              ' 1 ' +
              point(start) +
              ' Z';
            return <Path key={category} d={arc} {...props} />;
          })}
        </Svg>
      ) : (
        <Text>No expenses this month.</Text>
      )}
      {groups.map(([c, v], i) => (
        <Pressable
          key={c}
          onPress={() => select(c)}
          style={{
            padding: 8,
            borderLeftWidth: 5,
            borderColor: colors[i % colors.length],
            backgroundColor: 'white',
          }}
        >
          <Text>
            {c} · {((100 * v) / total).toFixed(1)}% · {v.toLocaleString()}
          </Text>
        </Pressable>
      ))}
      {groups.some(([c]) => c === selected) && (
        <View style={{ gap: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>{selected} expenses</Text>
          {expenses
            .filter((item) => item.category === selected)
            .map((item) => (
              <Text
                key={item.id}
                onPress={() =>
                  navigation.navigate('Expense Detail', { id: item.id })
                }
              >
                {item.expenseName} · {item.amount.toLocaleString()} ·{' '}
                {item.date}
              </Text>
            ))}
        </View>
      )}
    </ScrollView>
  );
}
