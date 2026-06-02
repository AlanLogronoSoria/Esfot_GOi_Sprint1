import React, { memo, useCallback, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList, Keyboard } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useMapSearch } from '@/features/map/application/map.hooks';
import type { CampusLocation } from '@/features/map/domain/location.entity';
import { LightTheme as T, Sizes, Shadows } from '@/constants/design-system';

interface MapSearchBarProps { onSelectLocation: (l: CampusLocation) => void; onSearchStateChange?: (s: boolean) => void; }

export const MapSearchBar = memo(function MapSearchBar({ onSelectLocation, onSearchStateChange }: MapSearchBarProps) {
  const { results, setSearch } = useMapSearch('');
  const [focused, setFocused] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const inp = useRef<TextInput>(null);

  const handleChange = useCallback((t: string) => { setQuery(t); setSearch(t); }, [setSearch]);
  const handleFocus = useCallback(() => { setFocused(true); onSearchStateChange?.(true); }, [onSearchStateChange]);
  const handleBlur = useCallback(() => { setTimeout(() => { setFocused(false); onSearchStateChange?.(false); }, 200); }, [onSearchStateChange]);
  const handleSelect = useCallback((l: CampusLocation) => { onSelectLocation(l); setQuery(''); setSearch(''); setFocused(false); Keyboard.dismiss(); }, [onSelectLocation, setSearch]);
  const handleClear = useCallback(() => { setQuery(''); setSearch(''); inp.current?.focus(); }, [setSearch]);

  return (
    <View style={ss.wrap}>
      <View style={ss.bar}>
        <Text style={ss.icon}>🔍</Text>
        <TextInput ref={inp} style={ss.inp} placeholder="Buscar lugares en el campus..." placeholderTextColor={T.inputPlaceholder} value={query} onChangeText={handleChange} onFocus={handleFocus} onBlur={handleBlur} returnKeyType="search" />
        {query.length > 0 && <TouchableOpacity onPress={handleClear}><Text style={ss.clear}>✕</Text></TouchableOpacity>}
      </View>
      {focused && query.length >= 2 && (
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
          {results.length > 0 ? (
            <View style={ss.results}>
              <FlatList data={results.slice(0, 6)} keyExtractor={(i) => i.id} keyboardShouldPersistTaps="handled" renderItem={({ item }) => (
                <TouchableOpacity style={ss.item} onPress={() => handleSelect(item)} activeOpacity={0.6}>
                  <Text style={ss.itemTitle}>{item.name}</Text>
                  {item.description && <Text style={ss.itemDesc} numberOfLines={1}>{item.description}</Text>}
                </TouchableOpacity>
              )} />
            </View>
          ) : (
            <View style={ss.noRes}><Text style={ss.noResT}>No se encontraron lugares</Text></View>
          )}
        </Animated.View>
      )}
    </View>
  );
});

const ss = StyleSheet.create({
  wrap: { zIndex: 100 },
  bar: { flexDirection: 'row', alignItems: 'center', backgroundColor: T.surface, borderRadius: Sizes.radiusMd, paddingHorizontal: 14, height: 48, ...Shadows.md },
  icon: { fontSize: 16, marginRight: 8 },
  inp: { flex: 1, fontSize: 15, color: T.inputText, paddingVertical: 0 },
  clear: { fontSize: 14, color: T.textTertiary, padding: 4 },
  results: { backgroundColor: T.surface, borderRadius: Sizes.radiusMd, marginTop: 6, padding: 4, ...Shadows.md, maxHeight: 240 },
  item: { paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: T.divider },
  itemTitle: { fontSize: 14, fontWeight: '600', color: T.textPrimary },
  itemDesc: { fontSize: 12, color: T.textTertiary, marginTop: 2 },
  noRes: { backgroundColor: T.surface, borderRadius: Sizes.radiusMd, marginTop: 6, padding: 16, alignItems: 'center' },
  noResT: { fontSize: 13, color: T.textTertiary },
});
