import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  date: string;
  time?: string;
  location?: string;
  image?: string;
};

const EventCard: React.FC<Props> = ({ title, date, time, location, image }) => {
  return (
    <View style={s.card}>
      {image ? <Image source={{ uri: image }} style={s.image} /> : <View style={s.noImage} />}
      <View style={s.body}>
        <Text style={s.title}>{title}</Text>
        <Text style={s.meta}>{date} {time ? '· ' + time : ''}</Text>
        {location ? <Text style={s.meta}>{location}</Text> : null}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', marginBottom: 12, elevation: 1 },
  image: { width: 100, height: 100 },
  noImage: { width: 100, height: 100, backgroundColor: '#eee' },
  body: { padding: 10, flex: 1 },
  title: { fontWeight: '700', marginBottom: 6 },
  meta: { color: '#666' },
});

export default EventCard;
