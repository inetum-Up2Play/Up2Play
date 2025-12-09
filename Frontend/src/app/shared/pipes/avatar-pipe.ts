import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatarImg',
  standalone: true 
})
export class AvatarPipe implements PipeTransform {

  transform(avatar: number | undefined | null): string {
    const cdnBase = 'https://up2play-mvp.github.io/CDN/avatar/';
    const map: Record<number, string> = {
      1 : 'avatar-1.png',
      2 : 'avatar-2.png',
      3 : 'avatar-3.png',
      4 : 'avatar-4.png',
      5 : 'avatar-5.png',
      6 : 'avatar-6.png',
      7 : 'avatar-7.png',
      8 : 'avatar-8.png',
      9 : 'avatar-9.png',
      10 : 'avatar-10.png',
    };

    if (avatar == null) {
      return cdnBase + 'default.png';
    }

    return cdnBase + (map[avatar] ?? 'default.png');
  }

}
