import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatarImg',
  standalone: true 
})
export class AvatarPipe implements PipeTransform {

  transform(avatar: number | undefined | null): string {
    const cdnBase = 'https://up2play-mvp.github.io/CDN/avatar/';
    const map: Record<number, string> = {
      1 : 'avatar-1.webp',
      2 : 'avatar-2.webp',
      3 : 'avatar-3.webp',
      4 : 'avatar-4.webp',
      5 : 'avatar-5.webp',
      6 : 'avatar-6.webp',
      7 : 'avatar-7.webp',
      8 : 'avatar-8.webp',
      9 : 'avatar-9.webp',
      10 : 'avatar-10.webp',
    };

    if (avatar == null) {
      return cdnBase + 'default.webp';
    }

    return cdnBase + (map[avatar] ?? 'default.webp');
  }

}
