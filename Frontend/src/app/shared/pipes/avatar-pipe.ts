import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatar'
})
export class AvatarPipe implements PipeTransform {

  transform(avatar: string): string {
    const cdnBase = 'https://up2play-mvp.github.io/CDN/avatar/';
    const map: Record<string, string> = {
      'avatar-1': 'avatar-1.png',
      'avatar-2': 'avatar-2.png',
      'avatar-3': 'avatar-3.png',
      'avatar-4': 'avatar-4.png',
      'avatar-5': 'avatar-5.png',
      'avatar-6': 'avatar-6.png',
      'avatar-7': 'avatar-7.png',
      'avatar-8': 'avatar-8.png',
      'avatar-9': 'avatar-9.png',
      'avatar-10': 'avatar-10.png',
    };

    return cdnBase + (map[avatar] || 'default.jpg');
  }

}
