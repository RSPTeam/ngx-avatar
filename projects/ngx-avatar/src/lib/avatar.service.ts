import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AVATAR_CONFIG } from './avatar-config.token';
import { AvatarConfig } from './avatar-config';
import { Injectable, Inject, Optional } from '@angular/core';
import { AvatarSource } from './sources/avatar-source.enum';

/**
 * list of Supported avatar sources
 */
const defaultSources = [
  AvatarSource.FACEBOOK,
  AvatarSource.GOOGLE,
  AvatarSource.TWITTER,
  AvatarSource.VKONTAKTE,
  AvatarSource.SKYPE,
  AvatarSource.GRAVATAR,
  AvatarSource.GITHUB,
  AvatarSource.CUSTOM,
  AvatarSource.INITIALS,
  AvatarSource.VALUE
];

/**
 * list of default colors
 */
const defaultColors = [
  '#1abc9c',
  '#3498db',
  '#f1c40f',
  '#8e44ad',
  '#e74c3c',
  '#d35400',
  '#2c3e50',
  '#7f8c8d'
];

/**
 * Provides utilities methods related to Avatar component
 */
@Injectable()
export class AvatarService {
  public avatarSources: AvatarSource[] = defaultSources;
  public avatarColors: string[] = defaultColors;

  constructor(
    @Optional()
    @Inject(AVATAR_CONFIG)
    private avatarConfig: AvatarConfig,
    private http: HttpClient
  ) {
    if (this.avatarConfig) {
      this.overrideAvatarSources();
      this.overrideAvatarColors();
    }
  }

  public fetchAvatar(avatarUrl: string): Observable<any> {
    return this.http.get(avatarUrl);
  }

  public getRandomColor(avatarText: string): string {
    if (!avatarText) {
      return 'transparent';
    }
    const asciiCodeSum = this.calculateAsciiCode(avatarText);
    return this.avatarColors[asciiCodeSum % this.avatarColors.length];
  }

  public copmareSources(
    sourceType1: AvatarSource,
    sourceType2: AvatarSource
  ): number {
    return (
      this.getSourcePriority(sourceType1) - this.getSourcePriority(sourceType2)
    );
  }

  public isSource(source: string): boolean {
    return this.avatarSources.includes(source as AvatarSource);
  }

  public isTextAvatar(sourceType: AvatarSource): boolean {
    return [AvatarSource.INITIALS, AvatarSource.VALUE].includes(sourceType);
  }

  private overrideAvatarSources(): void {
    // TODO: add sources to avatarConfig and implement this
  }

  private overrideAvatarColors(): void {
    if (this.avatarConfig.colors && this.avatarConfig.colors.length > 0) {
      this.avatarColors = this.avatarConfig.colors;
    }
  }

  private calculateAsciiCode(value: string): number {
    return value
      .split('')
      .map(letter => letter.charCodeAt(0))
      .reduce((previous, current) => previous + current);
  }

  private getSourcePriority(sourceType: AvatarSource) {
    return this.avatarSources.indexOf(sourceType);
  }
}
