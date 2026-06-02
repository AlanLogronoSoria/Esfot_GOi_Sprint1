import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import type { UpdateProfileInput, ChangePasswordInput } from '@/features/auth/domain/auth.schema';
import type { User } from '@/core/types';
import { useCallback } from 'react';

export function useProfile() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const updateProfileAction = useAuthStore((s) => s.updateProfile);
  const changePasswordAction = useAuthStore((s) => s.changePassword);
  const isLoading = useAuthStore((s) => s.isLoading);

  const updateProfile = useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfileAction(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['profile'] });
      const previousUser = queryClient.getQueryData<User>(['profile']);

      queryClient.setQueryData<User>(['profile'], (old) => {
        if (!old) return old;
        return {
          ...old,
          fullName: input.fullName ?? old.fullName,
          phone: input.phone || null,
          avatarUrl: input.avatarUrl ?? old.avatarUrl,
        };
      });

      return { previousUser };
    },
    onError: (_err, _input, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['profile'], context.previousUser);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const changePassword = useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      changePasswordAction(input.currentPassword, input.newPassword),
  });

  const refreshProfile = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  }, [queryClient]);

  return {
    user,
    isLoading,
    updateProfile,
    changePassword,
    refreshProfile,
  };
}
