//
//  GameController.m
//  NewProject-desktop
//
//  Created by cocos on 2022/11/17.
//

#import <Foundation/Foundation.h>
#include "GameController.h"
#import "platform/mac/AppDelegate.h"
#include "cocos/bindings/event/EventDispatcher.h"
#include "platform/mac/MacPlatform.h"

@implementation GameController {
    NSArray<GCController *>* _controllers;
    cc::MacPlatform* _platform;
}

- (id) init {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector (controllerDidConnect)
                                                 name: GCControllerDidConnectNotification
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector (controllerDidDisconnect)
                                                 name: GCControllerDidDisconnectNotification
                                               object:nil];
    _platform = dynamic_cast<cc::MacPlatform*>(cc::BasePlatform::getPlatform());
    return self;
}

- (void) updateControllers {
    _controllers = [GCController controllers];
    NSEnumerator *enumerator = [_controllers objectEnumerator];
    GCController* controller;
    while (controller = [enumerator nextObject]) {
        controller.extendedGamepad.valueChangedHandler = ^(GCExtendedGamepad * gamepad, GCControllerElement * element) {
            [self sendControllerData: gamepad];
        };
    }
}

- (void) sendControllerData:(GCExtendedGamepad *)gamepad {
    std::unique_ptr<cc::ControllerInfo> controllerInfoPtr = std::make_unique<cc::ControllerInfo>();
    std::vector<cc::ControllerInfo::ButtonInfo> buttonInfos;
    
    buttonInfos.push_back(cc::ControllerInfo::ButtonInfo(cc::StickKeyCode::A, gamepad.buttonA.isPressed));
    buttonInfos.push_back(cc::ControllerInfo::ButtonInfo(cc::StickKeyCode::B, gamepad.buttonB.isPressed));
    buttonInfos.push_back(cc::ControllerInfo::ButtonInfo(cc::StickKeyCode::X, gamepad.buttonX.isPressed));
    buttonInfos.push_back(cc::ControllerInfo::ButtonInfo(cc::StickKeyCode::Y, gamepad.buttonY.isPressed));
    
    buttonInfos.push_back(cc::ControllerInfo::ButtonInfo(cc::StickKeyCode::L1, gamepad.leftShoulder.isPressed));
    buttonInfos.push_back(cc::ControllerInfo::ButtonInfo(cc::StickKeyCode::R1, gamepad.rightShoulder.isPressed));
    if (@available(macOS 10.14.1, *)) {
        buttonInfos.push_back(cc::ControllerInfo::ButtonInfo(cc::StickKeyCode::L3, gamepad.leftThumbstickButton.isPressed));
    } else {
        // Fallback on earlier versions
    }
    if (@available(macOS 10.14.1, *)) {
        buttonInfos.push_back(cc::ControllerInfo::ButtonInfo(cc::StickKeyCode::R3, gamepad.rightThumbstickButton.isPressed));
    } else {
        // Fallback on earlier versions
    }
    if (@available(macOS 10.15, *)) {
        buttonInfos.push_back(cc::ControllerInfo::ButtonInfo(cc::StickKeyCode::MINUS, gamepad.buttonOptions.isPressed));
    } else {
        // Fallback on earlier versions
    }
    if (@available(macOS 10.15, *)) {
        buttonInfos.push_back(cc::ControllerInfo::ButtonInfo(cc::StickKeyCode::PLUS, gamepad.buttonMenu.isPressed));
    } else {
        // Fallback on earlier versions
    }
    
    //set axis value
    std::vector<cc::ControllerInfo::AxisInfo> axisInfos;
    axisInfos.push_back(cc::ControllerInfo::AxisInfo(cc::StickAxisCode::X, gamepad.dpad.xAxis.value));
    axisInfos.push_back(cc::ControllerInfo::AxisInfo(cc::StickAxisCode::Y, gamepad.dpad.yAxis.value));
    axisInfos.push_back(cc::ControllerInfo::AxisInfo(cc::StickAxisCode::L2, gamepad.leftTrigger.value));
    axisInfos.push_back(cc::ControllerInfo::AxisInfo(cc::StickAxisCode::R2, gamepad.rightTrigger.value));
    
    axisInfos.push_back(cc::ControllerInfo::AxisInfo(cc::StickAxisCode::LEFT_STICK_X, gamepad.leftThumbstick.xAxis.value));
    axisInfos.push_back(cc::ControllerInfo::AxisInfo(cc::StickAxisCode::LEFT_STICK_Y, gamepad.leftThumbstick.yAxis.value));
    axisInfos.push_back(cc::ControllerInfo::AxisInfo(cc::StickAxisCode::RIGHT_STICK_X, gamepad.rightThumbstick.xAxis.value));
    axisInfos.push_back(cc::ControllerInfo::AxisInfo(cc::StickAxisCode::RIGHT_STICK_Y, gamepad.rightThumbstick.yAxis.value));
    
    controllerInfoPtr->buttonInfos = buttonInfos;
    controllerInfoPtr->axisInfos = axisInfos;
    
    controllerInfoPtr->napdId = gamepad.controller.playerIndex;
    cc::ControllerEvent ev;
    ev.controllerInfos.push_back(std::move(controllerInfoPtr));
    _platform->dispatchEvent(ev);
}

- (void) onControllerDidConnect {
    [self updateControllers];
    return;
}

- (void) onControllerDidDisconnect {
    [self updateControllers];
    return;
}
@end

