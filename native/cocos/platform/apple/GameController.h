//
//  GameController.h
//  NewProject
//
//  Created by cocos on 2022/11/17.
//

#pragma once
#import <Cocoa/Cocoa.h>
#include <memory>
#include "base/std/container/string.h"
#import <GameController/GameController.h>
#include "base/Macros.h"

@interface GameController : NSObject
- (void)onControllerDidConnect;
- (void)onControllerDidDisconnect;

- (void)updateControllers;
- (void)sendControllerData:(GCExtendedGamepad *)gamepad;
@end

