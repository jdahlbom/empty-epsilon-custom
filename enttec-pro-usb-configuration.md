Empty Epsilon DMX pre-configuration for Enttec Pro USB
======================================================

Intent here is to use Enttec DMX USB Pro converter to 
drive DMX bus connected devices from Empty Epsilon bridge simulator

Versions and devices
--------------------
Ubuntu 18.04
Enttec DMX USB Pro - Mk 1 (the one without Mk2 in the title)
OLAD - the version available at default APT repos.

What else have I tried?
-----------------------
###Ubuntu 16.04
Could not run OLAD without problems, decided to upgrade to next LTS version. Fixed the OLAD issue.

###Cheap USB to RS422 FTDI 232 converter device from Amazon 
Could not get any reasonable output, OLAD does not play nice with it.

Solved my problems by switching to Enttec DMX USB Pro. I spent well over my lost time in wages trying to get
that Chinese wonder working, so should have put down more money in the first place for well supported equipment.

Testing the equipment
---------------------
Enttec DMX USB Pro is well supported in many of the DMX software available,
so we can test our whole DMX setup easily with OLAD (Open Lighting Architecture).

This lets us set each bus address value manually without running Empty Epsilon as yet another
source of potential errors.

Just install OLAD, plug in Enttec device, select it from the Add Universe-page
and use the Serial Console to set the values. Please tell me if you run into problems at this step. 

What to do before Empty Epsilon DMX will work?
----------------------------------------------
###Check which device the Enttec converter is set to: 
`dmesg|grep USB`

###Set this in the hardware.ini
Without the /dev/ prefix.

Also set up a Condition=Always test rule with correct DMX channel and easily verifiable control value.

###Test if it works using root privileges
`sudo EmptyEpsilon` and start server and client.
Your Always-rule should trigger and DMX device channel should get set to given value.

###Configure the device type ownership
Since running anything as root is usually a bad idea, you shouldn't run Empty Epsilon as root either, which
would be the fastest way to solve this, but would leave your system vulnerable to any security flaws in Empty Epsilon
server code.

OLAD seems to run with root privileges or with access to `dialout` group, which you will notice
the /dev/ttyUSB[0-9] belongs to, by running `ls -l /dev/ttyUSB[0-9]`.

Empty Epsilon is run using your user privileges, which do not include that group.
Add your user (or specific EE user if you prefer) to `dialout` group:
`usermod -a -G dialout yourusername`.
At least in Ubuntu you will need to login again to get your group info active for the user.

######Configure udev rule
To see what kinds of values you can match with udev rules, you should check out
`sudo udevadm info --attribute-walk --path=/sys/bus/usb-serial/devices/ttyUSB0`
where ttyUSB0 should also be replaced with whatever number your ttyUSB device was set to.

Add the following to `/etc/udev/rules.d/99-ttyusb.rules` (which you may have to create):
`KERNEL=="ttyUSB[0-9]*", ATTRS{idVendor}=="0403", ATTRS{idProduct}=="6001", ATTRS{manufacturer}=="ENTTEC", GROUP="dialout", MODE="0660", SYMLINK="ttyUSBEnttec"`

For me, running `ls -l /dev/ttyUSB*` shows correct group and symlink by name `/dev/ttyUSBEnttec` pointing to it.
Now we can point Empty Epsilon to device ttyUSBEnttec and not worry about which ttyUSBX number it got this time.

